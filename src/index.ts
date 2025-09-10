import * as tsConfigPaths from 'tsconfig-paths';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'node:fs/promises';
import path from 'node:path';
import { Payload } from './api/schema/auth';
import { PaymentFieldsSchema } from './api/schema/common';

declare module 'fastify' {
  interface FastifyRequest {
    user?: Payload; // Replace `any` with a proper JWT payload type if known
    validatedPayment?: PaymentFieldsSchema; // add a type for validated data ofline payment
    uploadedFile?: any; // also for ofline payment
  }
}

const baseUrl = './build';

const start = async () => {
  const tsconfigJson = await fs.readFile(
    path.join(process.cwd(), 'tsconfig.json'),
    'utf-8',
  );
  const tsconfig = JSON.parse(tsconfigJson) as TsConfig;

  tsConfigPaths.register({
    baseUrl,
    paths: tsconfig['compilerOptions']['paths'],
  });

  import('./server.js');
};
start();

type TsConfig = {
  extends: string;
  compilerOptions: {
    rootDir: string;
    baseUrl: string;
    outDir: string;
    esModuleInterop: boolean;
    paths: {
      '@src/*': Array<string>;
    };
  };
  include: Array<string>;
};
