import express from 'express';
import searchStartup from '../controllers/startupController/searchStartup';
import getStartups, { getRandomStartups } from '../controllers/startupController/getStartups';
import multer, { FileFilterCallback } from 'multer';
import createStartup, {
  handleLogoUpload
} from '../controllers/startupController/createStartup';
import getStartupFilters from '../controllers/startupController/getStartupFilters';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/')
  .post(upload.single('photo'), handleLogoUpload, createStartup)
  .get(getStartups);

router.get('/random', getRandomStartups);
router.get('/search', searchStartup);
router.get('/filters', getStartupFilters);

export default router;
