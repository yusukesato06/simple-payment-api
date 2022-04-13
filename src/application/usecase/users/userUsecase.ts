import { User } from '../../../domain/model/user/user';
import { UserRepositoryInterface } from '../../../domain/model/user/userRepositoryInterface';
import { AccountRepositoryInterface } from '../../../domain/model/account/accountRepositoryInterface';
import { HttpStatusCode, ApiError } from '../../../utils/customError';
import {
  UserServiceInterface,
  UserService,
} from '../../../domain/service/userService';

export interface UserUsecaseInterface {
  /**
   * ユーザの登録を行う
   *
   * @param name
   * @param email
   * @param rawPassword
   */
  signup({
    name,
    email,
    rawPassword,
  }: {
    name: string;
    email: string;
    rawPassword: string;
  }): Promise<User>;
  /**
   * ユーザの認証を行う
   *
   * @param email
   * @param rawPassword
   */
  auth({
    email,
    rawPassword,
  }: {
    email: string;
    rawPassword: string;
  }): Promise<{ token: string }>;
}

export class UserUsecase implements UserUsecaseInterface {
  private userService: UserServiceInterface;

  constructor(
    private userRepository: UserRepositoryInterface,
    private getAccountRepository: (userId: string) => AccountRepositoryInterface
  ) {
    this.userService = new UserService(userRepository, getAccountRepository);
  }

  signup = async ({
    name,
    email,
    rawPassword,
  }: {
    name: string;
    email: string;
    rawPassword: string;
  }): Promise<User> => {
    const existUser = await this.userRepository.loadByEmail(email);
    if (existUser) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `this email is already exist. email: ${email}`
      );
    }

    return this.userService.create({ name, email, rawPassword });
  };

  auth = async ({
    email,
    rawPassword,
  }: {
    email: string;
    rawPassword: string;
  }): Promise<{ token: string }> => {
    const user = await this.userRepository.loadByEmail(email);
    if (!user) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `this email is not registered. email: ${email}`
      );
    }

    const token = user.issueAccessToken(rawPassword);
    return { token };
  };
}
