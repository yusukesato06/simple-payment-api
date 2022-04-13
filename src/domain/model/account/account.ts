import { ApiError, HttpStatusCode } from '../../../utils/customError';

const INITIAL_BALANCE = 0;
const DEFAULT_DEPOSIT_LIMIT = 100000;
const DEFAULT_WITHDRAW_LIMIT = 100000;

export class Account {
  private id?: string;
  private userId: string;
  private balance: number;
  private depositLimit: number;
  private withdrawLimit: number;

  constructor({
    id,
    userId,
    balance,
    depositLimit,
    withdrawLimit,
  }: {
    id?: string;
    userId: string;
    balance?: number;
    depositLimit?: number;
    withdrawLimit?: number;
  }) {
    this.id = id;
    this.userId = userId;
    this.balance = balance ?? INITIAL_BALANCE;
    this.depositLimit = depositLimit ?? DEFAULT_DEPOSIT_LIMIT;
    this.withdrawLimit = withdrawLimit ?? DEFAULT_WITHDRAW_LIMIT;
  }

  setId = (id: string): void => {
    this.id = id;
  };

  getId = (): string | undefined => {
    return this.id;
  };

  getUserId = (): string => {
    return this.userId;
  };

  getBalance = (): number => {
    return this.balance;
  };

  getDepositLimit = (): number => {
    return this.depositLimit;
  };

  getWithdrawLimit = (): number => {
    return this.withdrawLimit;
  };

  pay = (amount: number): void => {
    if (amount > this.balance) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `you don't have enough money on your account. balance: ${this.balance}`
      );
    }

    this.balance = this.balance - amount;
  };

  receive = (amount: number): void => {
    this.balance = this.balance + amount;
  };

  withdraw = (amount: number): void => {
    if (amount > this.balance || amount > this.withdrawLimit) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `you don't have enough money on your account or exceed the withdraw limit. balance: ${this.balance} withdrawLimit: ${this.withdrawLimit}`
      );
    }

    this.balance = this.balance - amount;
  };

  deposit = (amount: number): void => {
    if (amount > this.depositLimit) {
      throw new ApiError(
        HttpStatusCode.BadRequest,
        `you exceed the deposit limit. depositLimit: ${this.depositLimit}`
      );
    }

    this.balance = this.balance + amount;
  };
}
