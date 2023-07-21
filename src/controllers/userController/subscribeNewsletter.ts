import { RequestHandler } from 'express';
import catchAsync from '../../utils/asyncUtils';
import EmailSubscriber from '../../models/EmailSubscriber';

const handler: RequestHandler = async (req, res, next) => {
  if (await EmailSubscriber.findOne({ email: req.query.email }))
    return res.status(200).json({ status: 'SUBSCRIBED' });

  await new EmailSubscriber({ email: req.query.email }).save();
  res.status(201).json({ status: 'SUBSCRIBED' });
};

export default catchAsync(handler);
