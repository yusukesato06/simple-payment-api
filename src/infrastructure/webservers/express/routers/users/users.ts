import express from 'express';

import { UsersController } from '../../../../../interface/controllers/usersController';
import { ApiError } from '../../../../../utils/customError';
import {
  UserAuthRequestType,
  UserSignupRequestType,
} from '../../models/userRequest';

export const usersRouter = express.Router();
const controller = new UsersController();

usersRouter.post(
  '/users/signup',
  async (req: express.Request, res: express.Response) => {
    const requestBody: UserSignupRequestType = req.body;

    if (!requestBody.email)
      res.status(400).send({ message: 'you should set email.' });
    if (!requestBody.name)
      res.status(400).send({ message: 'you should set name.' });
    if (!requestBody.password)
      res.status(400).send({ message: 'you should set password.' });

    await controller
      .signUp(requestBody)
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);

usersRouter.post(
  '/users/auth',
  async (req: express.Request, res: express.Response) => {
    const requestBody: UserAuthRequestType = req.body;

    if (!requestBody.email)
      res.status(400).send({ message: 'you should set email.' });
    if (!requestBody.password)
      res.status(400).send({ message: 'you should set password.' });

    await controller
      .auth(requestBody)
      .then((result) => {
        res.send(result);
      })
      .catch((error: ApiError) => {
        console.error(`[ERROR][API] errorStack: ${error.stack}`);
        res.status(error.statusCode).send({ message: error.message });
      });
  }
);
