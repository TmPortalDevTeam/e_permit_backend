import createHttpError from 'http-errors';
import { RequestValidationError } from '@ts-rest/fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

export const err = createHttpError;

export const requestValidationErrorHandler = (
    error: RequestValidationError,
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const message = error.body?.issues?.map(i => `${i.path?.map(p => p)?.join(', ')}: ${i.message}`)?.join('; ');
    throw err.BadRequest(message || 'Validation failed');
};

export const errorUtil = {
    err,
    requestValidationErrorHandler,
};