import { CommonQuery, limitOffset, resp } from '@api/schema/common';
import { MultipartFile } from '@fastify/multipart';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI, tugdkServiceAPI } from '@src/infra/extrnal-api/service';
import {
  CreateAuthoritiesExternalApi,
  GetAllRejectedPermit,
  PemritCreate,
  PermitCreateExternalApi,
  PermitStatusUpdate,
  UpdatePermitStatus7
} from '@src/api/schema/permit';
import { fileManagerService } from '@src/infra/file-manager';
import { sendEmailWithNodemailer } from '@src/utils/nodemailer';

const createPermit = async (d: PemritCreate) => {
  const one = await repo.createPermit(d);
  if (!one) {
    throw err.InternalServerError('Do not create permit and other data');
  }
  return resp.parse({ data: one });
}

const getAllPermits = async (p: CommonQuery) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllPermits({ limit, offset });
  if (!permits) throw err.InternalServerError();

  return resp.parse({ data: permits });
}

const rejectedPermits = async (p: GetAllRejectedPermit) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllRejectedPermits({ ...p, limit, offset });
  if (!permits) throw err.InternalServerError();

  return resp.parse({ data: permits });
}

const getPermitByID = async (id: string) => {
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

  return resp.parse({ data: result });
}

const updatePermitStatusTo3 = async (permitId: string) => {
  const status: number = 3;

  const one = await repo.findOne({ uuid: permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(permitId, { 'status': status });
  if (!updated) throw err.InternalServerError(`Failed to update permit status ${status}`);

  const response = await tugdkServiceAPI.permitSetStatus(permitId, status);
  if (!response) throw err.InternalServerError('External API request failed');

  return resp.parse({ data: null });
}

const updatePermitStatusTo4 = async (permitId: string) => {
  const status: number = 4

  const one = await repo.findOne({ uuid: permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(permitId, { 'status': status });
  if (!updated) throw err.InternalServerError(`Failed to update permit status ${status}`);

  const response = await tugdkServiceAPI.permitSetStatus(permitId, status);
  if (!response) throw err.InternalServerError('External API request failed');

  return resp.parse({ data: null });
}

const setPermitStatus = async (d: UpdatePermitStatus7) => {
  const one = await repo.findOne({ uuid: d.permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(d.permitId, {
    'status': d.status,
    'body': d.body
  });
  if (!updated) throw err.InternalServerError(`Failed to update permit ${d.permitId}`);

  const response = await tugdkServiceAPI.permitSetStatus7(d);
  if (!response) throw err.InternalServerError('External API request failed');

  return resp.parse({ message: 'Permit status updated and external API notified successfully' });
}

const changePermitStatus = async (d: PermitStatusUpdate) => {
  const one = await repo.findOne({ uuid: d.permitId });
  if (!one) throw err.NotFound('Permit');

  const updated = await repo.edit(d.permitId, { 'status': d.status });
  if (!updated) throw err.InternalServerError(`Failed to update permit ${d.permitId}`);

  const response = await tugdkServiceAPI.permitSetStatus(d.permitId, d.status);
  if (!response) throw err.InternalServerError('Failed to send status update to external API');

  return resp.parse({ data: null });
}

const getPermits = async () => {
  const response = await permitServiceAPI.getPermits();
  if (!response) throw err.InternalServerError('Failed to read response body');

  const content = response.content;

  if (content === undefined || content === null) {
    throw err.InternalServerError('Content field is null or undefined');
  }

  return resp.parse({ data: content })
}

const addPermitsExternalApi = async (d: PermitCreateExternalApi) => {
  const response = await permitServiceAPI.addPermits(d);
  if (!response) {
    throw err.InternalServerError('Failed to add permit to external API');
  }
  return resp.parse({ data: response });
}

const getPermitsByID = async (permitID: string) => {
  const response = await permitServiceAPI.getPermitsByID(permitID);
  if (!response) throw err.InternalServerError('External API responded with non-OK status getPermitByID');

  return resp.parse({ data: response });
}

const revokePermit = async (permitID: string) => {
  const response = await permitServiceAPI.revokePermit(permitID);
  if (!response) throw err.InternalServerError('Failed to send request to external API revoke');

  return resp.parse({ data: response });
}

const getPermitPDF = async (permitID: string) => {
  const response = await permitServiceAPI.getPermitPDF(permitID);
  if (!response) throw err.InternalServerError('Failed to send request to external API get permit pdf');

  return resp.parse({ data: response });
}

const findPermit = async (permitID: string) => {
  const response = await permitServiceAPI.findPermit(permitID);
  if (!response) throw err.InternalServerError('Failed to send request to external API find permit');

  return resp.parse({ data: response });
}

const getAuthorities = async () => {
  const response = await permitServiceAPI.getAuthorities();
  if (!response) throw err.InternalServerError('Failed to send request to external API getAuthorities');

  return resp.parse({ data: response });
}

const postAuthorities = async (d: CreateAuthoritiesExternalApi) => {
  const response = await permitServiceAPI.postAuthorities(d);
  if (!response) throw err.InternalServerError('Failed to send request to external API getAuthorities');

  return resp.parse({ data: response });
}

const getAuthorityByCode = async (authorityCode: string) => {
  const response = await permitServiceAPI.getAuthorityByCode(authorityCode);
  if (!response) throw err.InternalServerError('Failed to send request to external API get Authority By Code');

  return resp.parse({ data: response });
}


//
//

export const sendEmail = async (ledgerID: string, pdf: MultipartFile) => {
  // const one = await repo.getOne(ledgerID);
  // if (!one) throw err.NotFound();

  const buffer = await pdf.toBuffer();
  if (!buffer) throw err.BadRequest();

  const file = await fileManagerService.save({ meta: pdf, buffer, folder: 'public' });

  const emailStatus: boolean = await sendEmailWithNodemailer('ismayylata@gmail.com', file);
  if (!emailStatus) throw err.BadGateway('Email send pdf file error, please say admin')

  console.log(ledgerID)
  console.log(file)
  console.log(emailStatus)
  // // await repo.edit(id, { avatar: file });

  // if (one.avatar) {
  //   await fileManagerService.remove({ fileName: one.avatar, folder: 'public' });
  // }

  // const resData = await repo.getOne(ledgerID);
  // if (!resData) throw err.NotFound();
  // return resData;
  return resp.parse({ data: null });
};






const getAllAuthority = async () => {
  const result = await permitServiceAPI.getAllAuthority();
  if (!result) throw err.InternalServerError('Internal api mistake, please say admin');

  return result
}









export const permitService = {
  createPermit,
  getAllPermits,
  rejectedPermits,
  revokePermit,
  getPermitPDF,
  findPermit,
  getAuthorities,
  postAuthorities,
  //
  //
  sendEmail,
  getPermitsByID,

  getAllAuthority,
  getAuthorityByCode,
  getPermitByID,
  updatePermitStatusTo3,
  updatePermitStatusTo4,
  setPermitStatus,
  changePermitStatus,
  getPermits,
  addPermitsExternalApi,
};