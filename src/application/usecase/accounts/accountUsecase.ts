import { Account } from '../../../domain/model/account/account';
import { AccountRepositoryInterface } from '../../../domain/model/account/accountRepositoryInterface';
import { AccountActivity } from '../../../domain/model/accountActivity/accountActivity';
import { AccountActivityRepositoryInterface } from '../../../domain/model/accountActivity/accountActivityRepositoryInterface';
import {
  DepositService,
  DepositServiceInterface,
} from '../../../domain/service/depositService';
import {
  PaymentService,
  PaymentServiceInterface,
} from '../../../domain/service/paymentService';
import {
  WithdrawService,
  WithdrawServiceInterface,
} from '../../../domain/service/withdrawService';
import { ApiError, HttpStatusCode } from '../../../utils/customError';

export interface AccountUsecaseInterface {
  /**
   * ユーザの所有する口座一覧を取得するs
   *
   * @param userId
   */
  getAll({ userId }: { userId: string }): Promise<Account[]>;
  /**
   * 指定した口座へ指定金額の支払いを行う
   *
   * @param userId
   * @param accountId
   * @param targetUserId
   * @param targetAccountId
   * @param amount
   */
  payment({
    userId,
    accountId,
    targetUserId,
    targetAccountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    targetUserId: string;
    targetAccountId: string;
    amount: number;
  }): Promise<Account>;
  /**
   * 自身の指定口座へ預け入れを行う
   *
   * @param userId
   * @param accountId
   * @param amount
   */
  deposit({
    userId,
    accountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    amount: number;
  }): Promise<Account>;
  /**
   * 自身の指定口座から引き出しを行う
   *
   * @param userId
   * @param accountId
   * @param amount
   */
  withdraw({
    userId,
    accountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    amount: number;
  }): Promise<Account>;
  /**
   * 自身の口座の入出金履歴一覧を取得する
   *
   * @param userId
   * @param accountId
   * @param amount
   */
  getAllActivities({
    userId,
    accountId,
  }: {
    userId: string;
    accountId: string;
  }): Promise<AccountActivity[]>;
}

export class AccountUsecase implements AccountUsecaseInterface {
  private paymentService: PaymentServiceInterface;
  private depositService: DepositServiceInterface;
  private withdrawService: WithdrawServiceInterface;

  constructor(
    private getAccountRepository: (
      userId: string
    ) => AccountRepositoryInterface,
    private getAccountActivityRepository: (
      userId: string,
      accountId: string
    ) => AccountActivityRepositoryInterface
  ) {
    this.paymentService = new PaymentService(
      getAccountRepository,
      getAccountActivityRepository
    );
    this.depositService = new DepositService(
      getAccountRepository,
      getAccountActivityRepository
    );
    this.withdrawService = new WithdrawService(
      getAccountRepository,
      getAccountActivityRepository
    );
  }

  getAll = async ({ userId }: { userId: string }): Promise<Account[]> => {
    const accountRepository = this.getAccountRepository(userId);
    return accountRepository.loadAll();
  };

  payment = async ({
    userId,
    accountId,
    targetUserId,
    targetAccountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    targetUserId: string;
    targetAccountId: string;
    amount: number;
  }): Promise<Account> => {
    const executorAccountRepository = this.getAccountRepository(userId);
    const targetAccountRepository = this.getAccountRepository(targetUserId);

    const executorAccount = await executorAccountRepository.loadById(accountId);
    const targetAccount = await targetAccountRepository.loadById(
      targetAccountId
    );

    if (!executorAccount)
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `executor account is not found. accountId: ${accountId}`
      );
    if (!targetAccount)
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `target account is not found. accountId: ${targetAccountId}`
      );

    return this.paymentService.invoke({
      executorAccountId: accountId,
      executorAccount: executorAccount,
      targetAccountId: targetAccountId,
      targetAccount: targetAccount,
      amount: amount,
    });
  };

  deposit = async ({
    userId,
    accountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    amount: number;
  }): Promise<Account> => {
    const accountRepository = this.getAccountRepository(userId);
    const account = await accountRepository.loadById(accountId);
    if (!account) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `account is not found. accountId: ${accountId}`
      );
    }

    return this.depositService.invoke({ accountId, account, amount: amount });
  };

  withdraw = async ({
    userId,
    accountId,
    amount,
  }: {
    userId: string;
    accountId: string;
    amount: number;
  }): Promise<Account> => {
    const accountRepository = this.getAccountRepository(userId);
    const account = await accountRepository.loadById(accountId);
    if (!account) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `account is not found. accountId: ${accountId}`
      );
    }

    return this.withdrawService.invoke({ accountId, account, amount: amount });
  };

  getAllActivities({
    userId,
    accountId,
  }: {
    userId: string;
    accountId: string;
  }): Promise<AccountActivity[]> {
    const accountActivityRepository = this.getAccountActivityRepository(
      userId,
      accountId
    );
    return accountActivityRepository.loadAll();
  }
}
