import {
  UserUsecase,
  UserUsecaseInterface,
} from '../../application/usecase/users/userUsecase';
import { AccountFirestoreRepository } from '../../infrastructure/databases/firestore/user/account/accountRepositoryFirestore';
import { UserFirestoreRepository } from '../../infrastructure/databases/firestore/user/userRepositoryFirestore';

export class UserUsecaseRegistry {
  static getUserUsecase = (): UserUsecaseInterface => {
    return new UserUsecase(
      new UserFirestoreRepository(),
      (userId: string) => new AccountFirestoreRepository(userId)
    );
  };
}
