import { compareSync, hashSync } from 'bcrypt';

export class BcryptAdapter {
  static hash = (password: string) => hashSync(password, 10);

  static compare = (password: string, hashedPassword: string) => compareSync(password, hashedPassword);
}
