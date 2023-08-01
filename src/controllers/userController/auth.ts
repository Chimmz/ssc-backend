import { Request, RequestHandler } from 'express';
import User from '../../models/User';
import catchAsync from '../../utils/asyncUtils';
import HttpError from '../errorController/HttpError';
import emailService from '../../services/emailService';
import EmailVerification from '../../models/EmailVerification';
import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument } from '../../types';

const signToken = (userId: string) => {
  const token = jwt.sign({ uid: userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
  return token;
};

// SIGNUP
export const signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (await User.someUserExistsWithEmail(req.body.email))
    return next(
      new HttpError(400, 'Email in use', [
        { field: 'email', msg: 'Please double-check your information and try again' }
      ])
    );

  const newUser = await User.create({
    firstName: req.body.firstName || req.body.fullname?.split(' ')[0],
    lastName: req.body.lastName || req.body.fullname?.split(' ')[1],
    email,
    password
  });

  const newVerif = await EmailVerification.create({ email });

  const { successful } = await emailService.sendVerificationEmail(
    newUser,
    `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}?email=${
      newUser.email
    }`
  );
  res.status(201).json({ status: 'USER_CREATED', user: await User.findById(newUser._id) });
});

// LOGIN
export const login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email.trim() }).select('password');
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

  if (user.isEmailVerified)
    await EmailVerification.findOneAndDelete({ email: req.body.email.trim() });

  res.status(200).json({
    status: 'LOGIN_SUCCESS',
    user: await User.findOne({ email: req.body.email.trim() }).select('-password'),
    accessToken: signToken(user._id)
  });
});

export const resendVerificationEmail = catchAsync(async (req, res, next) => {
  if (!req.query.email) return next(new HttpError(400, 'No email specified'));

  const user = await User.findByEmail(req.query.email as string);
  if (!user) return next(new HttpError(404, 'No user with this email exists.'));
  await EmailVerification.removeVerificationsWithEmail(user.email);

  const newVerif = await EmailVerification.create({ email: user.email });
  const { successful } = await emailService.sendVerificationEmail(
    user,
    `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}?email=${user.email}`
  );
  res.status(200).json({ status: successful ? 'EMAIL_SENT' : 'NOT_SENT' });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.vid))
    return next(new HttpError(404, 'This link is broken. Please check and try again.'));

  const verif = await EmailVerification.findById(req.params.vid);
  const user = await User.findByEmail(req.query.email! as string);

  if (!user || (verif && verif.email !== req.query.email))
    return next(new HttpError(400, 'This link is broken. Please check and try again.'));

  if (!verif)
    return user?.isEmailVerified
      ? res.status(200).json({ status: 'EMAIL_PREVIOUSLY_VERIFIED' })
      : next(new HttpError(404, 'This link is invalid.'));

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
      `${process.env.SSC_FRONTEND_URL!}/auth/email-verify/${newVerif._id}?email=${user.email}`
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

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  });

  console.log('Result from Google: ', data);
  if (data.error) return res.json({ success: false, msg: 'Invalid token' });

  // @ts-ignore
  req.googleUser = data;
  next();
});

export const googleSignIn = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const existingUser = await User.findByEmail(req.googleUser.email);

  if (existingUser) {
    return res.status(200).json({
      status: 'LOGIN_SUCCESS',
      user: await User.findOne({ email: existingUser.email }).select('-password'),
      accessToken: signToken(existingUser._id)
    });
  }

  // @ts-ignore
  const newUser = await User.create({
    // @ts-ignore
    firstName: req.googleUser.given_name,
    // @ts-ignore
    lastName: req.googleUser.family_name,
    // @ts-ignore
    email: req.googleUser.email,
    // @ts-ignore
    isEmailVerified: req.googleUser.email_verified
  });

  res.status(201).json({
    status: 'USER_CREATED',
    user: await User.findById(newUser.id),
    accessToken: signToken(newUser._id)
  });
});
