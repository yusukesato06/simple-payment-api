import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { HttpStatusCode, ApiError } from '../../../utils/customError';

export class User {
  private id?: string;
  private name: string;
  private email: string;
  private encryptedPassword: string;

  constructor({
    id,
    name,
    email,
    rawPassword,
    encryptedPassword,
  }: {
    id?: string;
    name: string;
    email: string;
    rawPassword?: string;
    encryptedPassword?: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;

    if (!rawPassword && !encryptedPassword) {
      throw new ApiError(
        HttpStatusCode.Unauthorized,
        `you should input password.`
      );
    }
    this.encryptedPassword = encryptedPassword
      ? encryptedPassword
      : rawPassword
      ? crypto.createHash('sha256').update(rawPassword).digest('hex')
      : '';
  }

  setId(id: string): void {
    this.id = id;
  }

  getId = (): string | undefined => {
    return this.id;
  };

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getEncryptedPassword(): string {
    return this.encryptedPassword;
  }

  issueAccessToken(rawPassword: string): string {
    const encryptedPassword = crypto
      .createHash('sha256')
      .update(rawPassword)
      .digest('hex');
    if (encryptedPassword !== this.encryptedPassword) {
      throw new ApiError(HttpStatusCode.BadRequest, 'password is invalid');
    }

    const payload = {
      userId: this.id,
    };
    // [MEMO] 本来はconfigファイル等で管理するが今回は一旦ハードコードしてます
    const token = jwt.sign(
      payload,
      '6KKYxKS6e9ftLsNnnxFkDBMNTEQZt2a3APbaY6wgUSkHEDxk4yuwVC8FkN2zhg8V'
    );

    return token;
  }
}
