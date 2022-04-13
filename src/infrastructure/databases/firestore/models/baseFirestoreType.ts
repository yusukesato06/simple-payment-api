export type BaseFirestoreType<T> = T & {
  id: string;
  createdAtEpochMills: number;
  updatedAtEpochMills: number;
};
