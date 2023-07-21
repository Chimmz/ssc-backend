import News from '../../models/News';
import catchAsync from '../../utils/asyncUtils';
import { RequestHandler } from 'express';

const handler: RequestHandler = async (req, res, next) => {
  res.json('Ok');
};

export default catchAsync(handler);
