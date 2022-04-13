export type PaymentRequestType = {
  targetUserId: string;
  targetAccountId: string;
  amount: number;
};

export type DepositRequestType = {
  amount: number;
};

export type WithdrawRequestType = {
  amount: number;
};
