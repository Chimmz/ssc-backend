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

  // OR
  const stageQuery = stageFilters?.map(f => ({ stage: { $regex: `^${f}`, $options: 'i' } }));
  const industryQuery = industryFilters?.map(f => ({
    industries: { $regex: f, $options: 'i' }
  }));
  const queryOR: any[] = [];
  if (industryFilters?.length) queryOR.push(...industryQuery!);
  if (stageFilters?.length) queryOR.push(...stageQuery!);

  // AND
  const nameQuery = { name: { $regex: `^${searchQuery}`, $options: 'i' } };
  const descriptionQuery = { description: { $regex: searchQuery, $options: 'i' } };
  const queryAND: any[] = [];

  if (searchQuery) {
    // If user doesn't use the sidebar filter, make text search an OR query to search all docs
    // Else an AND query to search within the filtered results
    (!queryOR.length ? queryOR : queryAND).push(nameQuery, descriptionQuery);
  }

  // AND + OR filters
  const filters: { [k: string]: object } = {};
  if (queryOR.length) filters['$or'] = queryOR;
  if (queryAND.length) filters['$and'] = queryAND;

  console.log(filters);

  const [startups, total] = await Promise.all([
    Startup.find(filters),
    Startup.find(filters).count()
  ]);

  res.status(200).json({ status: 'SUCCESS', results: startups.length, total, startups });
};

export default catchAsync(searchStartups);
