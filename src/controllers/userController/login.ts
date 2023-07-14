import { RequestHandler } from 'express';
import User from '../../models/userModel';
import catchAsync from '../../utils/asyncUtils';

const login: RequestHandler = async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ status: 'USER_CREATED', user: newUser });
};

export default catchAsync(login);
