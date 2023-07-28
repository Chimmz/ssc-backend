import { RequestHandler } from 'express';
import News from '../models/News';
import HttpError from './errorController/HttpError';
import mongoose from 'mongoose';

export const getNews: RequestHandler = async (req, res, next) => {
  const { page = 1, limit = 4 } = req.query;
  const skip = +limit * (+page - 1);

  console.log({ page, limit, skip });

  const filter =
    'q' in req.query && req.query.q?.length && req.query.q !== 'undefined'
      ? { $text: { $search: req.query.q as string, $caseSensitive: false } }
      : {};

  console.log('Filter: ', filter);

  const [newsTotal, news] = await Promise.all([
    News.find(filter).count(),
    News.find(filter).skip(skip).limit(+limit).sort('-createdAt')
  ]);

  res.status(200).json({ status: 'SUCCESS', results: news.length, total: newsTotal, news });
};

export const getNewsById: RequestHandler = async (req, res, next) => {
  const newsItem = await News.findOne({
    _id: new mongoose.Types.ObjectId(req.params.newsId)
  });
  if (!newsItem) return next(new HttpError(404, 'News update not found'));

  res.status(200).json({ status: 'SUCCESS', newsItem });
};

export const postNews: RequestHandler = async (req, res, next) => {
  res.json('Ok');
};
