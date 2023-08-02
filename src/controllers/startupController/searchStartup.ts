import { RequestHandler } from 'express';
import catchAsync from '../../utils/asyncUtils';
import Startup from '../../models/Startup';

const searchStartups: RequestHandler = async (req, res, next) => {
  const searchQuery = req.query.q as string;
  const industryFilters = (req.query.industry as string | undefined)
    ?.split(',')
    .filter(f => !!f)
    .map(id => id.trim());

  const stageFilters = (req.query.stage as string | undefined)
    ?.split(',')
    .filter(f => !!f)
    .map(id => id.trim());

  // AND + OR filters
  const filters: { [k: string]: object } = {};

  console.log(filters);

  const [startups, total] = await Promise.all([
    Startup.find(filters),
    Startup.find(filters).count()
  ]);

  res.status(200).json({ status: 'SUCCESS', results: startups.length, total, startups });
};

export default catchAsync(searchStartups);
