import { Login, Payload } from '@api/schema/auth';
import { resp } from '@src/api/schema/common';
import { adminRepo as repo } from '@src/app/admin/repo';
import { bcryptService, err, jwtService } from '@src/utils';


const login = async (p: Login) => {
  let user = await repo.findOne({ username: p.username });
  if (!user) throw new err.NotFound();

  const passOk = await bcryptService.comparePass(p.password, user.password);
  if (!passOk) throw new err.Unauthorized();

  const admin: Payload = {
    uuid: user.uuid,
    role: user.role_name ?? '',
  }

  const accessToken = await jwtService.signAccessToken(admin);

  return resp.parse({
    data: {
      uuid: user.uuid,
      type: user.role_name ?? '',
      token: accessToken,
    }
  });
};

const getUserData = async (adminId: string) => {
  const user = await repo.findOne({ uuid: adminId });
  if (!user) throw new err.Unauthorized();

  return resp.parse({
    data: {
      uuid: user.uuid,
      username: user.username,
      name: user.name,
      role: user.role_name ?? '',
      role_id: user.role_id ?? '',
    }
  });
};

export const authService = {
  login,
  getUserData,
};