import { RequestHandler } from 'express';
import catchAsync from '../../utils/asyncUtils';
import Startup from '../../models/Startup';

const searchStartups: RequestHandler = async (req, res, next) => {
  const textQuery = (req.query.q as string | undefined)?.trim() as string;
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
  const nameQuery = { name: { $regex: `${textQuery}`, $options: 'i' } };
  const descriptionQuery = { description: { $regex: textQuery, $options: 'i' } };
  const textSearch = { $text: { $search: textQuery, $caseSensitive: false } };
  const queryAND: any[] = [];

  const filtersUsed = industryQuery?.length || stageQuery?.length;

  if (!filtersUsed && textQuery) queryOR.push(nameQuery, descriptionQuery);
  else if (filtersUsed && textQuery) {
    // Increase search accuracy for startup name, since text-search isn't accurate for startup names
    if (await Startup.findOne(nameQuery)) queryAND.push(nameQuery);
    else queryAND.push(textSearch);
  }

  // AND + OR filters
  const filters: { [k: string]: object } = {};
  if (queryOR.length) filters.$or = queryOR;
  if (queryAND.length) filters.$and = queryAND;

  console.log(filters);

  const [startups, total] = await Promise.all([
    Startup.find(filters),
    Startup.find(filters).count()
  ]);

  res.status(200).json({ status: 'SUCCESS', results: startups.length, total, startups });
};

export default catchAsync(searchStartups);
