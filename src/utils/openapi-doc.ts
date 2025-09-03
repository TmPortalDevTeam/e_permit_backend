import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from '../api/contracts';

const document = generateOpenApi(
    contract,
    {
        info: {
            title: 'E-Permit api',
            version: '1.0.0',
        },
    },
    { setOperationId: 'concatenated-path' },
);

export const openApi = {
    document,
};