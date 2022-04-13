import {
    AccountUsecase, AccountUsecaseInterface
} from '../../application/usecase/accounts/accountUsecase';
import {
    AccountActivityFirestoreRepository
} from '../../infrastructure/databases/firestore/user/account/accountActivity/accountActivityRepositoryFirestore';
import {
    AccountFirestoreRepository
} from '../../infrastructure/databases/firestore/user/account/accountRepositoryFirestore';

export class AccountUsecaseRegistry {
  static getAccountUsecase = (): AccountUsecaseInterface => {
    return new AccountUsecase(
      (userId: string) => new AccountFirestoreRepository(userId),
      (userId: string, accountId: string) =>
        new AccountActivityFirestoreRepository(userId, accountId)
    );
  };
}
