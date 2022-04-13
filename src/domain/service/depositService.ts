import { Account } from '../model/account/account';
import { AccountRepositoryInterface } from '../model/account/accountRepositoryInterface';
import {
  AccountActivity,
  ActivityType,
} from '../model/accountActivity/accountActivity';
import { AccountActivityRepositoryInterface } from '../model/accountActivity/accountActivityRepositoryInterface';

export interface DepositServiceInterface {
  /**
   * 自身の口座残高を更新し、口座に紐づく入出金履歴を作成する
   *
   * @param accountId
   * @param account
   * @param amount
   */
  invoke({
    accountId,
    account,
    amount,
  }: {
    accountId: string;
    account: Account;
    amount: number;
  }): Promise<Account>;
}

export class DepositService implements DepositServiceInterface {
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
    accountId,
    account,
    amount,
  }: {
    accountId: string;
    account: Account;
    amount: number;
  }): Promise<Account> => {
    const accountRepository = this.getAccountRepository(account.getUserId());
    const accountActivityRepository = this.getAccountActivityRepository(
      account.getUserId(),
      accountId
    );

    account.deposit(amount);
    const activity = {
      executorId: account.getUserId(),
      executorAccountId: accountId,
      targetUserId: account.getUserId(),
      targetAccountId: accountId,
      amount: amount,
      activityType: ActivityType.Deposit,
      activityDateEpochMills: new Date().getTime(),
    };
    const accountActivity = new AccountActivity(activity);

    // TODO: トランザクション管理する
    await accountRepository.update(accountId, account);
    await accountActivityRepository.create(accountActivity);

    return account;
  };
}
