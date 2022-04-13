import { Account } from './account';

export interface AccountRepositoryInterface {
  loadById(id: string): Promise<Account | undefined>;
  loadAll(): Promise<Account[]>;
  create(account: Account): Promise<Account>;
  update(id: string, account: Account): Promise<Account>;
}
