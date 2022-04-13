import { User } from './user';

export interface UserRepositoryInterface {
  loadByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
}
