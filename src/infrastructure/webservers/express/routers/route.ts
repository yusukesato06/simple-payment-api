import express from 'express';

import { verifyToken } from '../middlewares/verifyToken';
import { verifyUser } from '../middlewares/verifyUser';
import { accountsRouter } from './users/accounts/account';
import { usersRouter } from './users/users';

export const router = express.Router();

router.use('/', usersRouter);
router.use('/users/:userId', [verifyToken, verifyUser], accountsRouter);
