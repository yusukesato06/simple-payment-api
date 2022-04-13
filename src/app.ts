import { Firestore } from './infrastructure/databases/firestore/firestore';
Firestore.initialize();

import { server } from './infrastructure/webservers/express/server';
server.listen(3000);
