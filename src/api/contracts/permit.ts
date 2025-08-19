import z, { string } from 'zod';
import { initContract } from '@ts-rest/core';
import { permitSchema as schema } from '../schema/permit';

const c = initContract();

export const permitContract = c.router(
  {
    getQuotas: {
      method: 'GET',
      path: '/quotas/:code',
      pathParams: z.object({ code: z.string().trim() }),
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },
    addPermit: {
      method: 'POST',
      path: '/:code',
      pathParams: z.object({ code: z.string().trim() }),
      body: schema.create,
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },

  },
  { pathPrefix: '/api/permit' },
);