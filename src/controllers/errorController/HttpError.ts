interface FieldError {
  field: string;
  msg: string;
}

export default class HttpError extends Error {
  readonly message: string;
  readonly statusCode: number;
  readonly isBadRequest: boolean;
  readonly errors: FieldError[] | undefined;

  constructor(statusCode: number, msg: string, errors?: FieldError[]) {
    super(msg);
    this.message = msg;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isBadRequest = `${statusCode}`.startsWith('4');
  }
}
