import fs from 'fs';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/asyncUtils';
import HttpError from '../errorController/HttpError';
import sharp, { Metadata } from 'sharp';
import cloudinaryService from '../../services/cloudinaryService';
import Startup from '../../models/Startup';

const createStartup = catchAsync(async (req, res, next) => {
  const startup = await Startup.create({
    ...req.body,
    industries: req.body.industries?.split(',').map((ind: string) => ind.trim())
  });
  res.status(200).json({ status: 'STARTUP_CREATED', startup });
});

const getResizedLogoDimensions = ({ width = 120, height = 80 }: Metadata) => {
  if (width === height) return [120, 120];
  if (width > height) return [120, 80];
  return [150, 120];
};

export const handleLogoUpload = catchAsync(async (req, res, next) => {
  next();
});

export default createStartup;
