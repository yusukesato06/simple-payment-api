import { firestore } from 'firebase-admin';

import { User } from '../../../../domain/model/user/user';
import { UserRepositoryInterface } from '../../../../domain/model/user/userRepositoryInterface';
import { FirestoreClient, FirestoreClientInterface } from '../firestoreClient';
import { UserFirestoreType } from '../models/userFirestoreType';

export class UserFirestoreRepository implements UserRepositoryInterface {
  private firestore: FirestoreClientInterface<UserFirestoreType>;

  constructor() {
    const collection = firestore().collection('users');
    this.firestore = new FirestoreClient(collection);
  }

  loadByEmail = async (email: string): Promise<User | undefined> => {
    const query = this.firestore.collection.where('email', '==', email);
    const result = await this.firestore.loadByQuery(query);

    if (!result[0]) {
      return undefined;
    }
    return new User({
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      encryptedPassword: result[0].encryptedPassword,
    });
  };

  create = async (user: User): Promise<User> => {
    const firestoreUser: UserFirestoreType = {
      name: user.getName(),
      email: user.getEmail(),
      encryptedPassword: user.getEncryptedPassword(),
    };
    const result = await this.firestore.create(firestoreUser);

    user.setId(result.id);
    return user;
  };
}
