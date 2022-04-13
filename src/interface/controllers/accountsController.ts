import { AccountUsecaseInterface } from '../../application/usecase/accounts/accountUsecase';
import { Account } from '../../domain/model/account/account';
import { AccountActivity } from '../../domain/model/accountActivity/accountActivity';
import {
  DepositRequestType,
  PaymentRequestType,
  WithdrawRequestType,
} from '../../infrastructure/webservers/express/models/accountRequest';
import { AccountUsecaseRegistry } from '../../registry/usecase/accountUsecaseRegistry';

export class AccountsController {
  private accountUsecase: AccountUsecaseInterface;

  constructor() {
    this.accountUsecase = AccountUsecaseRegistry.getAccountUsecase();
  }

  getAll = async ({ userId }: { userId: string }): Promise<Account[]> => {
    return await this.accountUsecase.getAll({ userId });
  };

  payment = async ({
    userId,
    accountId,
    paymentRequest,
  }: {
    userId: string;
    accountId: string;
    paymentRequest: PaymentRequestType;
  }): Promise<Account> => {
    const request = {
      userId,
      accountId,
      targetUserId: paymentRequest.targetUserId,
      targetAccountId: paymentRequest.targetAccountId,
      amount: paymentRequest.amount,
    };
    return this.accountUsecase.payment(request);
  };

  deposit = async ({
    userId,
    accountId,
    depositRequest,
  }: {
    userId: string;
    accountId: string;
    depositRequest: DepositRequestType;
  }): Promise<Account> => {
    const request = {
      userId,
      accountId,
      amount: depositRequest.amount,
    };
    return this.accountUsecase.deposit(request);
  };

  withdraw = async ({
    userId,
    accountId,
    withdrawRequest,
  }: {
    userId: string;
    accountId: string;
    withdrawRequest: WithdrawRequestType;
  }): Promise<Account> => {
    const request = {
      userId,
      accountId,
      amount: withdrawRequest.amount,
    };
    return this.accountUsecase.withdraw(request);
  };

  getAllActivities = async ({
    userId,
    accountId,
  }: {
    userId: string;
    accountId: string;
  }): Promise<AccountActivity[]> => {
    const request = {
      userId,
      accountId,
    };
    return this.accountUsecase.getAllActivities(request);
  };
}
