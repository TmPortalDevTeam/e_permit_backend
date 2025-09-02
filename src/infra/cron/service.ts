import axios from 'axios';
import { db } from '@infra/db/db';
import { sql } from 'kysely';
import { getEnv } from '@src/infra/env/service';
import { logger } from '@src/utils';
import { err } from '@src/utils';

const PERMIT_API_URL = getEnv('E_PERMIT_API');
const url = `${PERMIT_API_URL}/permits`
const table = 'epermit_ledger_permits';
const maxRetries = 3;
const type: string = 'CRON';

const basicAuth = {
    auth: {
        username: getEnv('BASIC_AUTH_USERNAME'),
        password: getEnv('BASIC_AUTH_PASSWORD')
    },
    timeout: 5000, // 5 seconds
};

async function revokeAndMoveToBlackHistory() {
    const permits = await db
        .selectFrom(table)
        .select(['permit_id', 'company_name', 'used', 'issued_at', 'issuer'])
        .where('used', '=', false)
        .where('issuer', '=', 'TM')
        .where(sql<boolean>`TO_TIMESTAMP(${sql.ref('issued_at')}, 'DD/MM/YYYY') < NOW() - INTERVAL '5 days'`)
        .execute();

    await db.transaction().execute(async (trx) => {
        for (const permit of permits) {
            let revoked: boolean = false;    // Successfully recalled (200)
            let alreadyRevoked: boolean = false; // Already recalled (422)
            let failed: boolean = false;

            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    logger.info({ type, message: `Sending request to API: ${url}/${permit.permit_id}` });

                    const response = await axios.delete(`${url}/${permit.permit_id}`, basicAuth);

                    logger.info({ type, message: `Attempt ${attempt + 1}: Response for permit ${permit.permit_id}: ${response.status}` });

                    if (response.status === 200) {
                        revoked = true;
                        break;
                    }
                } catch (e: any) {
                    if (e.response?.status === 422) {
                        logger.warn({
                            type, message: `Permit ${permit.permit_id} already revoked.`
                        });
                        alreadyRevoked = true;
                        break;
                    }
                    logger.info({ type, message: `Attempt ${attempt + 1} failed for permit ${permit.permit_id} (${e.message})` });

                    if (attempt === maxRetries - 1) {
                        logger.error({
                            type,
                            message: `Failed to revoke permit ${permit.permit_id} after ${maxRetries} attempts`,
                            error: e.message,
                        });

                        failed = true;
                        throw err.BadGateway(`Failed to revoke permit ${permit.permit_id} after ${maxRetries} attempts`);
                    }
                }
            }

            // Skip insertion if permission has already been revoked
            if (alreadyRevoked) {
                logger.info({
                    type, message: `Skipping insert into black_history for permit ${permit.permit_id}, as it was already revoked.`
                });
                continue;
            }

            // Skip if you couldn't recall
            if (failed) {
                logger.warn({
                    type, message: `Skipping insert into black_history for permit ${permit.permit_id}, failed to revoke via API.`
                });
                continue;
            }

            // Insert only if successfully recalled
            if (revoked) {
                await trx.insertInto('black_history').values({
                    permit_id: permit.permit_id,
                    company_name: permit.company_name,
                    moved_at: new Date().toISOString(),
                }).execute();
            }
        }
    });
};

export const cronRevokeAndMoveToBlackHistory = async () => {
    try {
        logger.info({ type, message: 'Running revokeAndMoveToBlackHistory task...' });
        await revokeAndMoveToBlackHistory();
        logger.info({ type, message: 'Task completed successfully.' });
    } catch (err: any) {
        logger.error({
            type,
            status: err.status || null,
            message: err.message || 'Error in revoke task:',
            data: err.data || null
        });
    }
};

/* DAYANCH CODE: 

package main

import (
    "bytes"
    "context"
    "database/sql"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "time"

    _ "github.com/lib/pq"
)

const maxRetries = 3

// RevokeAndMoveToBlackHistory revokes permits from the database and moves them to black history
func revokeAndMoveToBlackHistory(db *sql.DB) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Fetch permits to revoke
    query := `
    SELECT permit_id, company_name 
    FROM epermit_ledger_permits
    WHERE used = false 
      AND TO_TIMESTAMP(issued_at, 'DD/MM/YYYY') < NOW() - INTERVAL '5 days'
      AND issuer = 'TM'
`
    rows, err := db.QueryContext(ctx, query)
    if err != nil {
        return fmt.Errorf("failed to fetch permits: %v", err)
    }
    defer rows.Close()

    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return fmt.Errorf("failed to start transaction: %v", err)
    }

    // Iterate over the results and revoke each permit
    for rows.Next() {
        var permitID, companyName string
        if err := rows.Scan(&permitID, &companyName); err != nil {
            tx.Rollback()
            return fmt.Errorf("failed to scan row: %v", err)
        }

        // Call the external API to revoke the permit with retry
        apiURL := fmt.Sprintf("http://216.250.9.213:8081/permits/%s", permitID)

        // Prepare the request body if needed (for POST requests)
        requestBody := []byte(`{}`) // Empty body if no payload is needed
        log.Printf("Sending request to API: %s\n", apiURL)
        log.Printf("Request Body: %s\n", string(requestBody))

        var resp *http.Response
        retriesExceeded := false
        for attempt := 0; attempt < maxRetries; attempt++ {
            req, err := http.NewRequest("DELETE", apiURL, bytes.NewBuffer(requestBody))
            if err != nil {
                tx.Rollback()
                return fmt.Errorf("failed to create request: %v", err)
            }

            // Add Basic Authentication
            req.SetBasicAuth("admin", "admin")

            client := &http.Client{Timeout: 5 * time.Second}
            resp, err = client.Do(req)
            if err != nil {
                log.Printf("Attempt %d: Failed to send request to revoke permit %s: %v\n", attempt+1, permitID, err)
                continue // Retry on error
            }
            defer resp.Body.Close()

            // Log the status code and response body for debugging
            body, err := ioutil.ReadAll(resp.Body)
            if err != nil {
                tx.Rollback()
                return fmt.Errorf("failed to read response body: %v", err)
            }

            log.Printf("Attempt %d: Response for permit %s: %s\n", attempt+1, permitID, string(body))

            // Handle the specific case when the permit is already revoked
            if resp.StatusCode == http.StatusUnprocessableEntity {
                log.Printf("Permit %s already revoked: %s\n", permitID, string(body))
                retriesExceeded = true
                break
            }

            // If the response is OK, break out of the retry loop
            if resp.StatusCode == http.StatusOK {
                break
            } else {
                log.Printf("Attempt %d: Failed to revoke permit %s, status code: %d, response: %s\n", attempt+1, permitID, resp.StatusCode, string(body))
                if attempt == maxRetries-1 {
                    tx.Rollback()
                    return fmt.Errorf("failed to revoke permit %s after %d attempts, status code: %d, response: %s", permitID, maxRetries, resp.StatusCode, string(body))
                }
            }
        }

        // Skip inserting into black history if the permit was already revoked
        if retriesExceeded {
            log.Printf("Skipping insert into black_history for permit %s, as it was already revoked.\n", permitID)
            continue
        }

        // Insert into black_history if API call succeeds
        insertQuery := `
        INSERT INTO black_history (permit_id, company_name, moved_at)
        VALUES ($1, $2, NOW())
    `
        _, err = tx.ExecContext(ctx, insertQuery, permitID, companyName)
        if err != nil {
            tx.Rollback()
            return fmt.Errorf("failed to insert into black_history: %v", err)
        }
    }

    if err = tx.Commit(); err != nil {
        return fmt.Errorf("failed to commit transaction: %v", err)
    }

    return nil
}

func main() {
    connStr := "postgres://postgres:test12@localhost/epermit?sslmode=disable"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatalf("failed to connect to database: %v", err)
    }
    defer db.Close()

    if err := revokeAndMoveToBlackHistory(db); err != nil {
        log.Fatalf("failed to revoke and move data to black history: %v", err)
    }

    log.Println("Successfully revoked permits and moved data to black history.")
}
*/