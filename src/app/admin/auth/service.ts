import { Login, Payload } from '@api/schema/auth';
import { adminRepo as repo } from '@src/app/admin/repo';
import { bcryptService, err, jwtService } from '@src/utils';

const login = async (p: Login) => {
  let user = await repo.findOne({ username: p.username });
  if (!user) throw new err.Unauthorized();

  const passOk = await bcryptService.comparePass(p.password, user.password);
  if (!passOk) throw new err.Unauthorized();

  const admin: Payload = {
    uuid: user.uuid,
    role: user.role_name ?? '',
  }

  const accessToken = await jwtService.signAccessToken(admin);

  return {
    uuid: user.uuid,
    username: user.username,
    role: user.role_name ?? '',
    accessToken,
  };
};

const me = async (adminId: string) => {
  const user = await repo.findOne({ uuid: adminId });
  if (!user) throw new err.Unauthorized();

  return {
    uuid: user.uuid,
    username: user.username,
    password_name: user.password_name,
    name: user.name,
    role: user.role_name ?? '',
  };
};

export const authService = {
  login,
  me,
};
