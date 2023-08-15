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
  if (!req.file) return next(new HttpError(400, 'No logo uploaded'));
  if (!req.file.mimetype.startsWith('image/'))
    return next(
      new HttpError(400, `Startup logo should be an image. Received '${req.file.mimetype}'`)
    );

  const filePath = `public/img/startups/logos/${req.body.name}-${Date.now()}.png`;
  const imgMetadata = await sharp(req.file.buffer).metadata();

  await sharp(req.file.buffer)
    // .resize(...getResizedLogoDimensions(imgMetadata))
    .resize(imgMetadata.width, imgMetadata.height)
    .toFormat('png')
    .png({ quality: 90 })
    .toFile(filePath);

  const { secure_url } = await cloudinaryService.upload('startup-logos', filePath);

  req.body.logoUrl = secure_url;

  // Delete file from server
  fs.unlink(filePath, err => {
    if (err) return console.log('Could not delete logo from server');
    console.log('Logo deleted from server');
  });

  if (!secure_url?.length)
    return next(new HttpError(500, 'We could not complete your upload. Please try again.'));

  next();
});

export default createStartup;
