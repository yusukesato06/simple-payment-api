import { firestore } from 'firebase-admin';

import { Account } from '../../../../../domain/model/account/account';
import { AccountRepositoryInterface } from '../../../../../domain/model/account/accountRepositoryInterface';
import {
  FirestoreClient,
  FirestoreClientInterface,
} from '../../firestoreClient';
import { AccountFirestoreType } from '../../models/accountFirestoreType';

export class AccountFirestoreRepository implements AccountRepositoryInterface {
  private readonly userId: string;
  private readonly firestore: FirestoreClientInterface<AccountFirestoreType>;

  constructor(userId: string) {
    this.userId = userId;
    const collection = firestore()
      .collection('users')
      .doc(userId)
      .collection('accounts');
    this.firestore = new FirestoreClient(collection);
  }

  loadAll = async (): Promise<Account[]> => {
    const result = await this.firestore.loadAll();

    return result.map((it) => {
      return new Account({
        id: it.id,
        userId: this.userId,
        balance: it.balance,
        depositLimit: it.depositLimit,
        withdrawLimit: it.withdrawLimit,
      });
    });
  };

  loadById = async (id: string): Promise<Account | undefined> => {
    const result = await this.firestore.loadById(id);
    if (!result) {
      return undefined;
    }

    return new Account({
      id: result.id,
      userId: result.userId,
      balance: result.balance,
      depositLimit: result.depositLimit,
      withdrawLimit: result.withdrawLimit,
    });
  };

  create = async (account: Account): Promise<Account> => {
    const firestoreAccount: AccountFirestoreType = {
      userId: account.getUserId(),
      balance: account.getBalance(),
      depositLimit: account.getDepositLimit(),
      withdrawLimit: account.getWithdrawLimit(),
    };
    const result = await this.firestore.create(firestoreAccount);

    account.setId(result.id);
    return account;
  };

  update = async (id: string, account: Account): Promise<Account> => {
    const firestoreAccount: AccountFirestoreType = {
      userId: account.getUserId(),
      balance: account.getBalance(),
      depositLimit: account.getDepositLimit(),
      withdrawLimit: account.getWithdrawLimit(),
    };
    await this.firestore.update(id, firestoreAccount);

    return account;
  };
}
