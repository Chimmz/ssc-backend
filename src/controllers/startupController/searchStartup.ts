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

  const nameQuery = { name: { $regex: `^${searchQuery}`, $options: 'i' } };
  const descriptionQuery = { description: { $regex: searchQuery, $options: 'i' } };

  const industryQuery = industryFilters?.map(f => ({
    industry: { $regex: f, $options: 'i' }
  }));
  const stageQuery = stageFilters?.map(f => ({ stage: { $regex: f, $options: 'i' } }));

  const queries: any[] = [];

  if (searchQuery) queries.push(nameQuery, descriptionQuery);
  if (industryFilters?.length) queries.push(...industryQuery!);
  if (stageFilters?.length) queries.push(...stageQuery!);

  console.log(queries);

  const [startups, total] = await Promise.all([
    Startup.find(queries.length ? { $or: queries } : {}),
    Startup.find(queries.length ? { $or: queries } : {}).count()
  ]);

  res.status(200).json({ status: 'SUCCESS', results: startups.length, total, startups });
};

export default catchAsync(searchStartups);
