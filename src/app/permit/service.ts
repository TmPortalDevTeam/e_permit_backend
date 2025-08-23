import { CommonQuery, limitOffset } from '@api/schema/common';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI, tugdkServiceAPI } from '@src/infra/extrnal-api/service';
import { GetAllRejectedPermit, PemritCreate } from '@src/api/schema/permit';


const getAuthorityByCode = async (code: string) => {
  const result = await permitServiceAPI.getAuthorityByCode(code);
  if (!result) throw err.InternalServerError('Internal api mistake, please say admin');

  return result
}

const getAllAuthority = async () => {
  const result = await permitServiceAPI.getAllAuthority();
  if (!result) throw err.InternalServerError('Internal api mistake, please say admin');

  return result
}

const createPermit = async (d: PemritCreate) => {
  const one = await repo.createPermit(d);
  if (!one) throw err.InternalServerError('Do not create permit and other data');

  return one;
}

const getAllPermits = async (p: CommonQuery) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllPermits({ limit, offset });
  if (!permits) throw err.InternalServerError();

  return permits;
}

const getAllRejectedPermits = async (p: GetAllRejectedPermit) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllRejectedPermits({ ...p, limit, offset });
  if (!permits) throw err.InternalServerError();

  return permits;
}

const adminGetPermitID = async (id: string) => {
  const one = await repo.findOne({ uuid: id });
  if (!one) throw err.NotFound('Permit');

  const currentViewsCount: number = one?.views_count ?? 0;
  const currentStatus: number = one?.status ?? 0;

  const newViewsCount: number = currentViewsCount + 1;
  let newStatus: number = currentStatus;

  if (newViewsCount > 0 && currentStatus === 1) newStatus = 2;

  const updated = await repo.edit(id, {
    'views_count': newViewsCount,
    'status': newStatus,
  });
  if (!updated) throw err.InternalServerError('Update error');

  const result = repo.getPermit(id);
  if (!result) throw err.InternalServerError('Error find By Id');

  await tugdkServiceAPI.updatePermitStatus(id, 2);

  return result;
}

const updatePermitStatusTo3 = async (permitId: string) => {
  const status: number = 3;

  const one = await repo.findOne({ uuid: permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(permitId, { 'status': status });
  if (!updated) throw err.InternalServerError(`Failed to update permit status ${status}`);

  const response = await tugdkServiceAPI.permitSetStatus(permitId, status);
  if (!response) throw err.InternalServerError('External API request failed');

  return null;
}


const updatePermitStatusTo4 = async (permitId: string) => {
  const status: number = 4

  const one = await repo.findOne({ uuid: permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(permitId, { 'status': status });
  if (!updated) throw err.InternalServerError(`Failed to update permit status ${status}`);

  const response = await tugdkServiceAPI.permitSetStatus(permitId, status);
  if (!response) throw err.InternalServerError('External API request failed');

  return null;
}


export const permitService = {
  getAllAuthority,
  getAuthorityByCode,
  createPermit,
  getAllPermits,
  getAllRejectedPermits,
  adminGetPermitID,
  updatePermitStatusTo3,
  updatePermitStatusTo4
};