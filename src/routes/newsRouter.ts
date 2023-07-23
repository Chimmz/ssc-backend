import { Router } from 'express';
import * as newsController from '../controllers/newsController';

const router = Router();

router.route('/').post(newsController.postNews).get(newsController.getNews);
router.route('/:newsId').get(newsController.getNewsById);

export default router;
