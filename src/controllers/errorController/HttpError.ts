interface HttpErrorObj extends Omit<Error, 'stack' | 'name'> {
  statusCode: number;
  isBadRequest: boolean;
}

// let a: HttpErrorObj = { }

export default class HttpError implements HttpErrorObj {
  readonly message: string;
  readonly statusCode: number;
  readonly isBadRequest: boolean;

  constructor(msg: string, statusCode: number) {
    this.message = msg;
    this.statusCode = statusCode;
    this.isBadRequest = `${statusCode}`.startsWith('4');
  }
}
