import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
} from '@google-cloud/firestore';

import { BaseFirestoreType } from './models/baseFirestoreType';
import { ApiError, HttpStatusCode } from '../../../utils/customError';

export interface FirestoreClientInterface<T extends DocumentData> {
  collection: CollectionReference;
  loadById(id: string): Promise<BaseFirestoreType<T> | undefined>;
  loadAll(): Promise<BaseFirestoreType<T>[]>;
  loadByQuery(query: Query): Promise<BaseFirestoreType<T>[]>;
  create(object: T): Promise<BaseFirestoreType<T>>;
  update(id: string, object: Partial<T>): Promise<BaseFirestoreType<T>>;
  delete(id: string): Promise<void>;
}

export class FirestoreClient<T extends DocumentData>
  implements FirestoreClientInterface<T>
{
  public readonly collection: CollectionReference;

  constructor(collection: CollectionReference) {
    this.collection = collection;
  }

  loadById = async (id: string): Promise<BaseFirestoreType<T> | undefined> => {
    const result = await this.collection.doc(id);
    const data = await result.get();

    if (!data.data()) {
      return undefined;
    }

    return { id: data.id, ...data.data() } as BaseFirestoreType<T>;
  };

  loadAll = async (): Promise<BaseFirestoreType<T>[]> => {
    const result = await this.collection.get();
    return result.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as BaseFirestoreType<T>)
    );
  };

  loadByQuery = async (query: Query): Promise<BaseFirestoreType<T>[]> => {
    const result = await query.get();
    return result.docs
      .filter((doc) => doc.exists)
      .map((doc) => ({ ...doc.data(), id: doc.id } as BaseFirestoreType<T>));
  };

  create = async (object: T): Promise<BaseFirestoreType<T>> => {
    const requestData = {
      createdAt: new Date().getTime(),
      updateAt: new Date().getTime(),
      ...object,
    };

    const result = await this.collection.add(requestData);
    const data = await result.get();
    return { id: data.id, ...data.data() } as BaseFirestoreType<T>;
  };

  update = async (
    id: string,
    object: Partial<T>
  ): Promise<BaseFirestoreType<T>> => {
    const ref: DocumentReference = this.collection.doc(id);
    const snap: DocumentSnapshot = await ref.get();

    if (!snap.exists) {
      throw new ApiError(
        HttpStatusCode.NotFound,
        `this data id not found. id: ${id}`
      );
    }

    const requestData = {
      updateAt: new Date().getTime(),
      ...object,
    };

    await ref.update(requestData);
    const data = await ref.get();
    return { id: data.id, ...data.data() } as BaseFirestoreType<T>;
  };

  delete = async (id: string): Promise<void> => {
    const ref: DocumentReference = this.collection.doc(id);
    const snap: DocumentSnapshot = await ref.get();

    if (!snap.exists) {
      throw new ApiError(
        HttpStatusCode.NotFound,
        `this data id not found. id: ${id}`
      );
    }

    await ref.delete();
  };
}
