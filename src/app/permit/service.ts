import { CommonQuery, limitOffset, resp } from '@api/schema/common';
import { MultipartFile } from '@fastify/multipart';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI, tugdkServiceAPI } from '@src/infra/extrnal-api/service';
import {
  GetAllRejectedPermit,
  PemritCreate,
  PermitActivityCreate,
  PermitCreateExternalApi,
  PermitStatusUpdate,
  UpdatePermitStatus7
} from '@src/api/schema/permit';
import { fileManagerService } from '@src/infra/file-manager';
import { sendEmailWithNodemailer } from '@src/utils/nodemailer';
import { AuthoritiesCreate, AuthoritiesQuotaCreate } from '@src/api/schema/authorities';

const createPermit = async (d: PemritCreate) => {
  const one = await repo.createPermit(d);
  if (!one) throw err.InternalServerError('Do not create permit and other data');

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
  if (!response) throw err.BadGateway('External API request failed');

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
    throw err.BadGateway('External API Content field is null or undefined');
  }

  return resp.parse({ data: content })
}

const addPermitsExternalApi = async (d: PermitCreateExternalApi) => {
  const response = await permitServiceAPI.addPermits(d);
  if (!response) throw err.BadGateway('Failed to add permit to external API');

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
  if (!response) throw err.BadGateway('Failed to send request to external API find permit');

  return resp.parse({ data: response });
}

const getAuthorities = async () => {
  const response = await permitServiceAPI.getAuthorities();
  if (!response) throw err.BadGateway('Failed to send request to external API getAuthorities');

  return resp.parse({ data: response });
}

const postAuthorities = async (d: AuthoritiesCreate) => {
  const response = await permitServiceAPI.postAuthorities(d);
  if (!response) throw err.BadGateway('Failed to send request to external API getAuthorities');

  return resp.parse({ data: response });
}

const getAuthorityByCode = async (authorityCode: string) => {
  const response = await permitServiceAPI.getAuthorityByCode(authorityCode);
  if (!response) throw err.BadGateway('Failed to send request to external API get Authority By Code');

  return resp.parse({ data: response });
}

const addQuota = async (code: string, d: AuthoritiesQuotaCreate) => {
  const response = await permitServiceAPI.addAuthoritiesQuota(code, d);
  if (!response) throw err.BadGateway('Failed to send request to external API add Authority Quota');

  return resp.parse({ data: response });
}

const AddPermitActivities = async (permitID: string, d: PermitActivityCreate) => {
  const response = await permitServiceAPI.addPermitActivities(permitID, d);
  if (!response) throw err.InternalServerError('Failed to send request to external API add Permit Activities');

  return resp.parse({ data: response });
}

export const sendEmail = async (ledgerID: string, pdf: MultipartFile) => {
  const epermit_ledger_permits = await permitServiceAPI.getPermitsByID(ledgerID);
  if (!epermit_ledger_permits) throw err.BadGateway('External API responded with non-OK getPermitByID');

  const company_id = epermit_ledger_permits.company_id;
  if (!company_id) throw err.BadGateway('External API responded getPermitByID with company_id error');

  const permit = await repo.getOneForEmail(company_id);
  if (!permit) throw err.InternalServerError('Do not find permit_uuid != company_id for email');

  const email = permit.email;
  if (!email) throw err.InternalServerError('Email empty or undefined');

  const buffer = await pdf.toBuffer();
  if (!buffer) throw err.BadRequest();

  const file = await fileManagerService.save({ meta: pdf, buffer, folder: 'public' });

  const emailStatus: boolean = await sendEmailWithNodemailer(email, file);
  if (!emailStatus) throw err.BadGateway('Email send pdf file error, please say admin')

  const fileRemove = await fileManagerService.remove({ fileName: file, folder: 'public' });
  if (!fileRemove) throw err.InternalServerError('Remove file error')

  const status: number = 5;
  const response = await tugdkServiceAPI.permitSetStatus(company_id, status);
  if (!response) throw err.BadGateway('External API request failed update permitSetStatus');

  return {
    email,
    status: "Email sent and status updated successfully",
  }
};




const getPermitStatus = async (permitUUID: string) => {
  const one = await repo.getOne(permitUUID);
  if (!one) throw err.NotFound('Permit not found');

  const { status, is_legal, sum } = one;
  const response = {
    permit_uuid: permitUUID,
    status: one.status,
  };

  if (!is_legal && status === 3) return { ...response, sum };

  return response;
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
  addQuota,
  AddPermitActivities,
  sendEmail,
  getPermitsByID,
  getPermitStatus,
  getAuthorityByCode,
  getPermitByID,
  updatePermitStatusTo3,
  updatePermitStatusTo4,
  setPermitStatus,
  changePermitStatus,
  getPermits,
  addPermitsExternalApi,
};