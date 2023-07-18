import { RequestHandler } from 'express';
import User from '../../models/userModel';
import catchAsync from '../../utils/asyncUtils';
import HttpError from '../errorController/HttpError';
import emailService from '../../services/emailService';
import EmailVerification from '../../models/verificationModel';
import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

const signToken = (userId: string) => {
  const token = jwt.sign({ uid: userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
  return token;
};

// SIGNUP
export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (await User.someUserExistsWithEmail(req.body.email))
    return next(
      new HttpError(400, 'Email in use', [
        { field: 'email', msg: 'This email is already in use' }
      ])
    );

  const firstName = req.body.firstName || req.body.fullname?.split(' ')[0];
  const lastName = req.body.lastName || req.body.fullname?.split(' ')[1];

  const newUser = await User.create({ email, password, firstName, lastName });
  const newVerif = await EmailVerification.create({ email });

  const { successful } = await emailService.sendVerificationEmail(
    newUser,
    `http://localhost:3000/auth/email-verify/${newVerif._id}`
  );
  res.status(201).json({ status: 'USER_CREATED', user: await User.findById(newUser._id) });
});

// LOGIN
export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('password');
  if (!user)
    return next(
      new HttpError(400, 'Wrong email or password entered', [
        { field: 'email', msg: 'Incorrect email entered' }
      ])
    );
  if (!(await user.verifyPassword(req.body.password)))
    return next(
      new HttpError(400, 'Wrong email or password entered', [
        { field: 'password', msg: 'Incorrect password entered' }
      ])
    );

  res.status(200).json({
    status: 'LOGIN_SUCCESS',
    user: await User.findOne({ email: req.body.email }).select('-password'),
    accessToken: signToken(user._id)
  });
});

export const verifyEmail: RequestHandler = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.vid))
    return next(
      new HttpError(404, 'This link is broken or malformed. Please check and try again')
    );

  const verif = await EmailVerification.findById(req.params.vid);
  if (!verif)
    return next(
      new HttpError(
        404,
        'The link you used has expired. If you think this was done by error, please contact support'
      )
    );

  const user = await User.findByEmail(verif.email);

  if (verif.isExpired()) {
    // await verif.deleteOne()
    console.log('Verif link has expired');
    const newVerif = await EmailVerification.create({ email: verif.email });

    const { successful } = await emailService.sendVerificationEmail(
      user,
      `http://localhost:3000/auth/email-verify/${newVerif._id}`
    );
    return next(new HttpError(400, 'This link has expired'));
  }

  user.isEmailVerified = true;
  await user.save();
  res.status(200).json({ status: 'EMAIL_VERIFIED' });
});
