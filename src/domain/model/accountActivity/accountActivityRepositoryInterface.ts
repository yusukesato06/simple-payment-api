import { AccountActivity } from './accountActivity';

export interface AccountActivityRepositoryInterface {
  loadAll(): Promise<AccountActivity[]>;
  create(accountActivity: AccountActivity): Promise<AccountActivity>;
}
