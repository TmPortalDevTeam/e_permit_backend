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
import { errorUtil } from './utils';
import { openApi } from './utils/openapi-doc';


const app = Fastify({ logger: { level: 'debug' } });
const NODE_ENV = getEnv('NODE_ENV');
const port = getEnv('PORT');
const host = NODE_ENV === 'dev' ? getEnv('HOST') : getEnv('HOST_PROD');

const s = initServer();

const start = async () => {
  try {
    await envCheck();
    await connectCheck();

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

    console.log(getEnv('EMAIL_PASSWORD'))
    app.get('/api/openapi', async () => openApi.document);

    s.registerRouter(contract, router, app, {
      requestValidationErrorHandler: errorUtil.requestValidationErrorHandler,
      logInitialization: true,
    });

    await app.listen({ port, host });
    console.log(`http://${host}:${port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();