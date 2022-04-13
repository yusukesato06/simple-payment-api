import admin from 'firebase-admin';

export class Firestore {
  static initialize = () => {
    admin.initializeApp({
      projectId: 'dummy-project',
    });
    admin.firestore().settings({ host: 'localhost:8080', ssl: false });
  };
}
