import { ErrorRequestHandler } from 'express';
import HttpError from './HttpError';

const globalErrorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  res.status(err.isBadRequest ? 400 : 500).json({
    status: err.isBadRequest ? 'fail' : 'error',
    msg: err.message
  });
};

export default globalErrorHandler;
