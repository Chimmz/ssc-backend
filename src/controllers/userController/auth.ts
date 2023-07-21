import { Request, RequestHandler } from 'express';
import User from '../../models/User';
import catchAsync from '../../utils/asyncUtils';
import HttpError from '../errorController/HttpError';
import emailService from '../../services/emailService';
import EmailVerification from '../../models/EmailVerification';
import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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
        { field: 'email', msg: 'Please double-check your information and try again' }
      ])
    );

  const firstName = req.body.firstName || req.body.fullname?.split(' ')[0];
  const lastName = req.body.lastName || req.body.fullname?.split(' ')[1];
  const newUser = await User.create({ email, password, firstName, lastName });
  const newVerif = await EmailVerification.create({ email });

  const { successful } = await emailService.sendVerificationEmail(
    newUser,
    `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}`
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

export const resendVerificationEmail: RequestHandler = catchAsync(async (req, res, next) => {
  if (!req.query.email) return next(new HttpError(400, 'No email specified'));

  const user = await User.findByEmail(req.query.email as string);
  if (!user) return next(new HttpError(404, 'No user with this email exists.'));
  await EmailVerification.removeVerificationsWithEmail(user.email);

  const newVerif = await EmailVerification.create({ email: user.email });
  const { successful } = await emailService.sendVerificationEmail(
    user,
    `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}`
  );
  res.status(200).json({ status: successful ? 'EMAIL_SENT' : 'NOT_SENT' });
});

export const verifyEmail: RequestHandler = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.vid))
    return next(
      new HttpError(404, 'This link is broken or malformed. Please check and try again.')
    );

  const verif = await EmailVerification.findById(req.params.vid);
  if (!verif) return next(new HttpError(404, 'This link is invalid.'));

  const user = await User.findByEmail(verif.email);

  // Invalidate link by deleting it
  const deleteVerification = async () => {
    await EmailVerification.findByIdAndRemove(req.params.vid);
  };

  if (verif.isExpired()) {
    deleteVerification();
    // Email a new verification link
    const newVerif = await EmailVerification.create({ email: verif.email });
    const { successful } = await emailService.sendVerificationEmail(
      user,
      `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}`
    );
    return next(
      new HttpError(
        400,
        'The link you used has expired. If you think this was done by error, please contact support.'
      )
    );
  }

  user.isEmailVerified = true;
  await user.save();
  deleteVerification();
  res.status(200).json({ status: 'EMAIL_VERIFIED' });
});

export const googleCallback = catchAsync(async (req, res, next) => {
  console.log(req.body, req.params);
  res.status(200);
});

export const googleVerify = catchAsync(async (req, res, next) => {
  const token = req.query.token;
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';

  const { data: result } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  });

  console.log('Result from Google: ', result);
  if (result.error) return res.json({ success: false, msg: 'Invalid token' });

  // @ts-ignore
  req.user = result;
  next();

  // return {
  //   success: true,
  //   user: {
  //     firstName: result.given_name,
  //     lastName: result.family_name,
  //     email: result.email,
  //     imgUrl: result.picture
  //   }
  // };
});

export const googleSignIn = catchAsync(async (req, res, next) => {
  // @ts-ignore
  console.log({ 'req.user': req.user });
});
