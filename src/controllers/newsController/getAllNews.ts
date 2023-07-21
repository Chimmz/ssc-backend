import News from '../../models/News';
import catchAsync from '../../utils/asyncUtils';
import { RequestHandler } from 'express';

const handler: RequestHandler = async (req, res, next) => {
  const { page = 1, limit = 4 } = req.query;
  const skip = +limit * (+page - 1);

  const filter =
    'q' in req.query && !!req.query.q?.length && req.query.q !== 'undefined'
      ? { $text: { $search: req.query.q as string, $caseSensitive: false } }
      : {};

  // const result = await News.aggregate([
  //   { $match: { $text: { $search: req.query.q as string, $caseSensitive: false } } },
  //   {
  //     $project: {
  //       newsHeadline: { $split: ['$headline', req.query.q] },
  //       newsStory: { $split: ['$story', req.query.q] },
  //       _id: 1
  //     }
  //   }
  // ]);
  // res.json(result);

  const news = await News.find(filter).skip(skip).limit(+limit).sort('-createdAt');
  res.status(200).json({ status: 'SUCCESS', results: news.length, news });
};

export default catchAsync(handler);
