import { Router } from 'express';
import { login, signup, verifyEmail } from '../controllers/userController/auth';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.get('/email-verify/:vid', verifyEmail);

export default router;
