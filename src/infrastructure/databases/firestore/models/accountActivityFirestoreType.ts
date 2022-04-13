export type AccountActivityFirestoreType = {
  executorId: string;
  executorAccountId: string;
  targetUserId: string;
  targetAccountId: string;
  amount: number;
  type: ActivityTypeFirestoreType;
  activityDateEpochMills: number;
};

export const ActivityTypeFirestoreType = {
  Deposit: 'Deposit',
  Withdraw: 'Withdraw',
  Payment: 'Payment',
  Receive: 'Receive',
} as const;
export type ActivityTypeFirestoreType =
  typeof ActivityTypeFirestoreType[keyof typeof ActivityTypeFirestoreType];
