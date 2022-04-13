import { User } from '../model/user/user';
import { AccountRepositoryInterface } from '../model/account/accountRepositoryInterface';
import { UserRepositoryInterface } from '../model/user/userRepositoryInterface';
import { Account } from '../model/account/account';
import { ApiError, HttpStatusCode } from '../../utils/customError';

export interface UserServiceInterface {
  /**
   * ユーザとユーザに紐づく口座の作成を行う
   *
   * @param name
   * @param email
   * @param rawPassword
   */
  create({
    name,
    email,
    rawPassword,
  }: {
    name: string;
    email: string;
    rawPassword: string;
  }): Promise<User>;
}

export class UserService implements UserServiceInterface {
  constructor(
    private userRepository: UserRepositoryInterface,
    private getAccountRepository: (userId: string) => AccountRepositoryInterface
  ) {}

  create = async ({
    name,
    email,
    rawPassword,
  }: {
    name: string;
    email: string;
    rawPassword: string;
  }): Promise<User> => {
    const user = new User({
      name,
      email,
      rawPassword,
    });
    const createdUser = await this.userRepository.create(user);

    const userId = createdUser.getId();
    // [MEMO] ここのエラーは本質的ではないですが、ドメインモデルのid周りを整理しきれてないためこの形なっています
    if (!userId)
      throw new ApiError(
        HttpStatusCode.NotFound,
        `this user is not found. userId: ${userId}`
      );

    const accountRepository = this.getAccountRepository(userId);
    const account = new Account({
      userId,
    });
    await accountRepository.create(account);

    return createdUser;
  };
}
