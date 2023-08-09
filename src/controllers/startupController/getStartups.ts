import { RequestHandler } from 'express';
import catchAsync from '../../utils/asyncUtils';
import Startup from '../../models/Startup';
import { isValidObjectId } from 'mongoose';
import HttpError from '../errorController/HttpError';

const getStartups: RequestHandler = catchAsync(async (req, res, next) => {
  const startups = await Startup.find().limit(+req.query.limit!);
  res.status(200).json({ status: 'SUCCESS', results: startups.length, startups });
});

export const getRandomStartups: RequestHandler = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 4;

  const startups = await Startup.aggregate([{ $sample: { size: +limit } }]);
  res.status(200).json({ status: 'SUCCESS', startups });
});

export default getStartups;
