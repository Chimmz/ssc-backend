import { ErrorRequestHandler } from 'express';
import HttpError from './HttpError';

const globalErrorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  const resObj = {
    status: err.isBadRequest ? 'fail' : 'error',
    msg: err.message,
    errors: err.errors
  };
  if (err.errors?.length) resObj.errors = err.errors;
  res.status(err.statusCode || (err.isBadRequest ? 400 : 500)).json(resObj);
};

export default globalErrorHandler;
