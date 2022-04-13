import { UserUsecaseInterface } from '../../application/usecase/users/userUsecase';
import { User } from '../../domain/model/user/user';
import {
    UserAuthRequestType, UserSignupRequestType
} from '../../infrastructure/webservers/express/models/userRequest';
import { UserUsecaseRegistry } from '../../registry/usecase/userUsecaseRegistry';

export class UsersController {
  private userUsecase: UserUsecaseInterface;

  constructor() {
    this.userUsecase = UserUsecaseRegistry.getUserUsecase();
  }

  signUp = async (signupRequest: UserSignupRequestType): Promise<User> => {
    const request = {
      name: signupRequest.name,
      email: signupRequest.email,
      rawPassword: signupRequest.password,
    };
    return this.userUsecase.signup(request);
  };

  auth = async (
    authRequest: UserAuthRequestType
  ): Promise<{ token: string }> => {
    const request = {
      email: authRequest.email,
      rawPassword: authRequest.password,
    };
    return this.userUsecase.auth(request);
  };
}
