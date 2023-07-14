import { RequestHandler, Request, Response, NextFunction } from 'express';

const catchAsync = (fn: RequestHandler) => {
  const newHandler: RequestHandler = (req, res, next) => {
    (fn(req, res, next) as unknown as Promise<any>).catch(next);
  };
  return newHandler;
};

export default catchAsync;
