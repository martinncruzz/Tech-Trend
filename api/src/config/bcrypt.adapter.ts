import { compareSync, hashSync } from 'bcrypt';

export class BcryptAdapter {
  static hash(password: string) {
    return hashSync(password, 10);
  }

  static compare(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }
}
