import { compare, hash } from 'bcryptjs';

const hashPass = (password: string) => {
  return hash(password, 10);
};

const comparePass = (plainString: string, hashString: string) => {
  return compare(plainString, hashString);
};

export const bcryptService = {
  hashPass,
  comparePass,
};