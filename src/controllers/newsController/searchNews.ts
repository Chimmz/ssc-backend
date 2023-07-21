import News from '../../models/News';
import catchAsync from '../../utils/asyncUtils';
import { RequestHandler } from 'express';

const handler: RequestHandler = async (req, res, next) => {
  const { q: searchQuery, page = 1, limit = 4 } = req.query;
  const skip = +limit * (+page - 1);

  const news = await News.find({
    $text: { $search: searchQuery as string, $caseSensitive: false }
  })
    .skip(skip)
    .limit(+limit)
    .sort('-createdAt');
  res.status(200).json({ status: 'SUCCESS', news });
};

export default catchAsync(handler);
