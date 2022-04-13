import { Account } from '../model/account/account';
import { AccountRepositoryInterface } from '../model/account/accountRepositoryInterface';
import {
  AccountActivity,
  ActivityType,
} from '../model/accountActivity/accountActivity';
import { AccountActivityRepositoryInterface } from '../model/accountActivity/accountActivityRepositoryInterface';

export interface PaymentServiceInterface {
  /**
   * 関連する口座の残高を更新し、口座に紐づく入出金履歴を作成する
   *
   * @param executorAccountId
   * @param executorAccount
   * @param targetAccountId
   * @param targetAccount
   * @param amount
   */
  invoke({
    executorAccountId,
    executorAccount,
    targetAccountId,
    targetAccount,
    amount,
  }: {
    executorAccountId: string;
    executorAccount: Account;
    targetAccountId: string;
    targetAccount: Account;
    amount: number;
  }): Promise<Account>;
}

export class PaymentService implements PaymentServiceInterface {
  constructor(
    private getAccountRepository: (
      userId: string
    ) => AccountRepositoryInterface,
    private getAccountActivityRepository: (
      userId: string,
      accountId: string
    ) => AccountActivityRepositoryInterface
  ) {}

  invoke = async ({
    executorAccountId,
    executorAccount,
    targetAccountId,
    targetAccount,
    amount,
  }: {
    executorAccountId: string;
    executorAccount: Account;
    targetAccountId: string;
    targetAccount: Account;
    amount: number;
  }): Promise<Account> => {
    const executorAccountRepository = this.getAccountRepository(
      executorAccount.getUserId()
    );
    const executorAccountActivityRepository = this.getAccountActivityRepository(
      executorAccount.getUserId(),
      executorAccountId
    );
    const targetAccountRepository = this.getAccountRepository(
      targetAccount.getUserId()
    );
    const targetAccountActivityRepository = this.getAccountActivityRepository(
      targetAccount.getUserId(),
      targetAccountId
    );

    executorAccount.pay(amount);
    const executorActivity = {
      executorId: executorAccount.getUserId(),
      executorAccountId: executorAccountId,
      targetUserId: targetAccount.getUserId(),
      targetAccountId: targetAccountId,
      amount: amount,
      activityType: ActivityType.Payment,
      activityDateEpochMills: new Date().getTime(),
    };
    const executorAccountActivity = new AccountActivity(executorActivity);

    targetAccount.receive(amount);
    const targetActivity = {
      executorId: executorAccount.getUserId(),
      executorAccountId: executorAccountId,
      targetUserId: targetAccount.getUserId(),
      targetAccountId: targetAccountId,
      amount: amount,
      activityType: ActivityType.Receive,
      activityDateEpochMills: new Date().getTime(),
    };
    const targetAccountActivity = new AccountActivity(targetActivity);

    // TODO: トランザクション管理する
    await executorAccountRepository.update(executorAccountId, executorAccount);
    await executorAccountActivityRepository.create(executorAccountActivity);
    await targetAccountRepository.update(targetAccountId, targetAccount);
    await targetAccountActivityRepository.create(targetAccountActivity);

    return executorAccount;
  };
}
