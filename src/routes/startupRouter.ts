import express from 'express';
import searchStartup from '../controllers/startupController/searchStartup';
import getStartups, { getRandomStartups } from '../controllers/startupController/getStartups';
import multer, { FileFilterCallback } from 'multer';
import createStartup, {
  handleLogoUpload
} from '../controllers/startupController/createStartup';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/')
  .post(upload.single('photo'), handleLogoUpload, createStartup)
  .get(getStartups);

router.route('/random').get(getRandomStartups);
router.route('/search').get(searchStartup);

export default router;
