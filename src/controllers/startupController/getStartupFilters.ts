import { RequestHandler } from 'express';
import Startup from '../../models/Startup';
import catchAsync from '../../utils/asyncUtils';

const handler: RequestHandler = async (req, res, next) => {
  let [{ industries, stages }] = await Startup.aggregate([
    { $project: { industries: 1, stage: 1 } },
    {
      $group: {
        industries: { $push: '$industries' },
        stages: { $addToSet: '$stage' },
        _id: null
      }
    },
    { $project: { _id: 0 } }
  ]);

  industries = Array.from(new Set(industries.flat())).sort();
  stages = Array.from(new Set(stages)).sort();

  res.status(200).json({ status: 'SUCCESS', industries, stages });
};

export default catchAsync(handler);
