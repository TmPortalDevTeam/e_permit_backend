import { ZodError } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

export class ZodFilter {
    catch(error: unknown, request: FastifyRequest, reply: FastifyReply) {
        if (error instanceof ZodError) {
            console.log("------------------------------------------------------")
            console.log(error)
            const formattedErrors = error.errors.map(err => ({
                path: err.path.join('.'),
                msg: err.message,
            }));

            return reply.status(400).send({
                message: 'VALIDATION_FAILED',
                errors: formattedErrors,
            });
        }

        return reply.status((error as any).statusCode || 500).send({
            message: (error as any).message || 'Internal Server Error',
        });
    }
};