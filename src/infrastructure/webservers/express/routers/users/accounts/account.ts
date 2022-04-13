import express from 'express';

import { AccountsController } from '../../../../../../interface/controllers/accountsController';
import { ApiError } from '../../../../../../utils/customError';
import {
  DepositRequestType,
  PaymentRequestType,
  WithdrawRequestType,
} from '../../../models/accountRequest';

export const accountsRouter = express.Router({ mergeParams: true });
const controller = new AccountsController();

accountsRouter.get(
  '/accounts',
  async (req: express.Request, res: express.Response) => {
    const userId: string = req.params.userId;

    await controller
      .getAll({ userId })
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);

accountsRouter.post(
  '/accounts/:accountId/payments',
  async (req: express.Request, res: express.Response) => {
    const userId: string = req.params.userId;
    const accountId: string = req.params.accountId;
    const requestBody: PaymentRequestType = req.body;

    if (!requestBody.targetUserId)
      res.status(400).send({ message: 'you should set targetUserId.' });
    if (!requestBody.targetAccountId)
      res.status(400).send({ message: 'you should set targetAccountId.' });
    if (!requestBody.amount)
      res.status(400).send({ message: 'you should set amount.' });

    await controller
      .payment({ userId, accountId, paymentRequest: requestBody })
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);

accountsRouter.post(
  '/accounts/:accountId/deposits',
  async (req: express.Request, res: express.Response) => {
    const userId: string = req.params.userId;
    const accountId: string = req.params.accountId;
    const requestBody: DepositRequestType = req.body;

    if (!requestBody.amount)
      res.status(400).send({ message: 'you should set amount.' });

    await controller
      .deposit({ userId, accountId, depositRequest: requestBody })
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);

accountsRouter.post(
  '/accounts/:accountId/withdrawals',
  async (req: express.Request, res: express.Response) => {
    const userId: string = req.params.userId;
    const accountId: string = req.params.accountId;
    const requestBody: WithdrawRequestType = req.body;

    if (!requestBody.amount)
      res.status(400).send({ message: 'you should set amount.' });

    await controller
      .withdraw({ userId, accountId, withdrawRequest: requestBody })
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);

accountsRouter.get(
  '/accounts/:accountId/activities',
  async (req: express.Request, res: express.Response) => {
    const userId: string = req.params.userId;
    const accountId: string = req.params.accountId;

    await controller
      .getAllActivities({ userId, accountId })
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);
