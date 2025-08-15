import { getEnv } from '@infra/env/service';
import { RoleEnum, Roles } from '@src/api/schema/admin';
import { Payload } from '@src/api/schema/auth';
import { err } from '@src/utils';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = getEnv('JWT_SECRET');
export const tokenKey = 'authToken';

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw err.Unauthorized();

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) throw err.Unauthorized();

    const payload = jwt.verify(token, JWT_SECRET);

    request.user = payload as Payload;
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized: Invalid token' });
  }
};


export const checkRole = (allowedRoles: Roles[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as Payload | undefined;
    if (!user) return reply.status(401).send({ message: 'Unauthorized' });

    const roleParse = RoleEnum.safeParse(user.role);
    if (!roleParse.success) {
      return reply.status(403).send({ message: 'Forbidden: Invalid role' });
    }

    if (!allowedRoles.includes(roleParse.data)) {
      return reply.status(403).send({ message: 'Forbidden: Insufficient role' });
    }
  };
};
