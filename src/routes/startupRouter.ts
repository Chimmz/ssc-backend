import express from 'express';
import searchStartup from '../controllers/startupController/searchStartup';
import getStartups, { getRandomStartups } from '../controllers/startupController/getStartups';

const router = express.Router();

router.route('/').get(getStartups);
router.route('/random').get(getRandomStartups);
router.route('/search').get(searchStartup);

export default router;
