import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import sensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import { initServer } from '@ts-rest/fastify';
import Fastify from 'fastify';
import path from 'node:path';
import { contract } from './api/contracts';
import { router } from './app/controller';
import { connectCheck } from './infra/db';
import { envCheck } from './infra/env';
import { getEnv } from './infra/env/service';

const app = Fastify({ logger: { level: 'debug' } });
const port = getEnv('PORT');
const host = getEnv('HOST');
const cookieSecret = getEnv('COOKIE_SECRET');

const s = initServer();

const start = async () => {
  try {
    await envCheck();
    await connectCheck();

    await app.register(cookie, {
      secret: cookieSecret,
      hook: 'onRequest',
      parseOptions: {
        httpOnly: getEnv('COOKIE_HTTP_ONLY'),
        secure: getEnv('COOKIE_SECURE'),
        sameSite: getEnv('COOKIE_SAME_SITE'),
        signed: true,
        path: '/',
      },
    });

    await app.register(cors, { origin: true, credentials: true });
    await app.register(fastifyHelmet);
    await app.register(sensible);
    await app.register(fastifyMultipart, {
      limits: {
        fileSize: 5000000, // 5mb
        files: 1,
      },
    });

    await app.register(fastifyStatic, {
      root: path.join(process.cwd(), 'public'),
      prefix: '/api/public',
    });

    s.registerRouter(contract, router, app);

    await app.listen({ port, host: getEnv('HOST') });
    console.log(`http://${host}:${port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
