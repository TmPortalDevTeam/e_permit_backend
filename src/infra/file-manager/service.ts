import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

type Folder = 'public';

const folder: Record<Folder, string> = {
  //   storage: join(process.cwd(), 'storage'),
  public: join(process.cwd(), 'public'),
};

const save = async (d: { meta: MultipartFile; buffer: Buffer; folder: Folder }): Promise<string> => {
  const fileName = `${randomUUID()}${extname(d.meta.filename)}`;
  const filePath = join(folder[d.folder], fileName);

  await writeFile(filePath, d.buffer);
  return fileName;
};

const remove = async (d: { fileName: string; folder: Folder }): Promise<Boolean> => {
  const filePath = join(folder[d.folder], d.fileName);
  if (!existsSync(filePath)) return false;
  await unlink(filePath);
  return true;
};

const exists = (d: { fileName: string; folder: Folder }) => {
  const filePath = join(folder[d.folder], d.fileName);
  return existsSync(filePath);
};

const getPath = (d: { fileName: string; folder: Folder }) => {
  return join(folder[d.folder], d.fileName);
};

export const fileManagerService = {
  save,
  remove,
  exists,
  getPath,
};
