import { Router } from 'express';
import * as authController from '../controllers/userController/auth';
import subscribeNewsletter from '../controllers/userController/subscribeNewsletter';

const router = Router();

router.route('/auth/signup').post(authController.signup);
router.route('/auth/login').post(authController.login);
router.get('/auth/email-verify/:vid', authController.verifyEmail);
router.post('/auth/send-email-verification', authController.resendVerificationEmail);

router
  .route('/auth/google-signin')
  .post(authController.googleVerify, authController.googleSignIn);

router.route('/newsletter').post(subscribeNewsletter);

export default router;
