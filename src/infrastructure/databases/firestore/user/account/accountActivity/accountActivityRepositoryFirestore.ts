import { firestore } from 'firebase-admin';

import {
  AccountActivity,
  ActivityType,
} from '../../../../../../domain/model/accountActivity/accountActivity';
import { AccountActivityRepositoryInterface } from '../../../../../../domain/model/accountActivity/accountActivityRepositoryInterface';
import {
  FirestoreClient,
  FirestoreClientInterface,
} from '../../../firestoreClient';
import {
  AccountActivityFirestoreType,
  ActivityTypeFirestoreType,
} from '../../../models/accountActivityFirestoreType';

export class AccountActivityFirestoreRepository
  implements AccountActivityRepositoryInterface
{
  private firestore: FirestoreClientInterface<AccountActivityFirestoreType>;

  constructor(userId: string, accountId: string) {
    const collection = firestore()
      .collection('users')
      .doc(userId)
      .collection('accounts')
      .doc(accountId)
      .collection('accountActivities');
    this.firestore = new FirestoreClient(collection);
  }

  loadAll = async (): Promise<AccountActivity[]> => {
    const query = this.firestore.collection
      .orderBy('activityDateEpochMills', 'desc')
      .limit(100);
    const result = await this.firestore.loadByQuery(query);

    return result.map((it) => {
      const type = (() => {
        switch (it.type) {
          case ActivityTypeFirestoreType.Payment:
            return ActivityType.Payment;
          case ActivityTypeFirestoreType.Receive:
            return ActivityType.Receive;
          case ActivityTypeFirestoreType.Deposit:
            return ActivityType.Deposit;
          case ActivityTypeFirestoreType.Withdraw:
            return ActivityType.Withdraw;
        }
      })();

      return new AccountActivity({
        id: it.id,
        executorId: it.executorId,
        executorAccountId: it.executorAccountId,
        targetUserId: it.targetUserId,
        targetAccountId: it.targetAccountId,
        amount: it.amount,
        activityType: type,
        activityDateEpochMills: it.activityDateEpochMills,
      });
    });
  };

  create = async (
    accountActivity: AccountActivity
  ): Promise<AccountActivity> => {
    const type = (() => {
      switch (accountActivity.getActivityType()) {
        case ActivityType.Payment:
          return ActivityTypeFirestoreType.Payment;
        case ActivityType.Receive:
          return ActivityTypeFirestoreType.Receive;
        case ActivityType.Deposit:
          return ActivityTypeFirestoreType.Deposit;
        case ActivityType.Withdraw:
          return ActivityTypeFirestoreType.Withdraw;
      }
    })();

    const firestoreAccountActivity: AccountActivityFirestoreType = {
      executorId: accountActivity.getExecutorId(),
      executorAccountId: accountActivity.getExecutorAccountId(),
      targetUserId: accountActivity.getTargetUserId(),
      targetAccountId: accountActivity.getTargetAccountId(),
      amount: accountActivity.getAmount(),
      type: type,
      activityDateEpochMills: accountActivity.getActivityDateEpochMills(),
    };
    const result = await this.firestore.create(firestoreAccountActivity);

    accountActivity.setId(result.id);
    return accountActivity;
  };
}
