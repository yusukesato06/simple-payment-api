export class AccountActivity {
  private id?: string;
  private executorId: string;
  private executorAccountId: string;
  private targetUserId: string;
  private targetAccountId: string;
  private amount: number;
  private activityType: ActivityType;
  private activityDateEpochMills: number;

  constructor({
    id,
    executorId,
    executorAccountId,
    targetUserId,
    targetAccountId,
    amount,
    activityType,
    activityDateEpochMills,
  }: {
    id?: string;
    executorId: string;
    executorAccountId: string;
    targetUserId: string;
    targetAccountId: string;
    amount: number;
    activityType: ActivityType;
    activityDateEpochMills?: number;
  }) {
    this.id = id;
    this.executorId = executorId;
    this.executorAccountId = executorAccountId;
    this.targetUserId = targetUserId;
    this.targetAccountId = targetAccountId;
    this.amount = amount;
    this.activityType = activityType;
    this.activityDateEpochMills =
      activityDateEpochMills ?? new Date().getTime();
  }

  setId = (id: string): void => {
    this.id = id;
  };

  getId = (): string | undefined => {
    return this.id;
  };

  getExecutorId = (): string => {
    return this.executorId;
  };

  getExecutorAccountId = (): string => {
    return this.executorAccountId;
  };

  getTargetUserId = (): string => {
    return this.targetUserId;
  };

  getTargetAccountId = (): string => {
    return this.targetAccountId;
  };

  getAmount = (): number => {
    return this.amount;
  };

  getActivityType = (): ActivityType => {
    return this.activityType;
  };

  getBalanceChangeType = (): BalanceChangeType => {
    switch (this.activityType) {
      case ActivityType.Deposit:
      case ActivityType.Receive:
        return BalanceChangeType.Increase;
      case ActivityType.Withdraw:
      case ActivityType.Payment:
        return BalanceChangeType.Decrease;
    }
  };

  getActivityDateEpochMills = (): number => {
    return this.activityDateEpochMills;
  };
}

export const BalanceChangeType = {
  Increase: '増加',
  Decrease: '減少',
} as const;
export type BalanceChangeType =
  typeof BalanceChangeType[keyof typeof BalanceChangeType];

export const ActivityType = {
  Deposit: '預け入れ',
  Withdraw: '引き出し',
  Payment: '支払い',
  Receive: '受け取り',
} as const;
export type ActivityType = typeof ActivityType[keyof typeof ActivityType];
