import { Router } from 'express';
import postNews from '../controllers/newsController/postNews';
import getAllNews from '../controllers/newsController/getAllNews';
import searchNews from '../controllers/newsController/searchNews';

const router = Router();

router.route('/').post(postNews).get(getAllNews);

router.get('/search', searchNews);

export default router;
