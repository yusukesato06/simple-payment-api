export class ApiError extends Error {
  statusCode: HttpStatusCode;

  constructor(statusCode: HttpStatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const HttpStatusCode = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
} as const;
export type HttpStatusCode = typeof HttpStatusCode[keyof typeof HttpStatusCode];
