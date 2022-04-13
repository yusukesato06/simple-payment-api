import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { router } from './routers/route';

export const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());
server.use('/api/v1', router);
