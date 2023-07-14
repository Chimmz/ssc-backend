import mongoose from 'mongoose';
import validator from 'validator';
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 50,
    trim: true,
    required: [true, 'Please enter your first name']
  },
  lastName: {
    type: String,
    maxlength: 40,
    trim: true,
    required: [true, 'Please enter your first name']
  },
  email: {
    type: 'String',
    lowercase: true,
    trim: true,
    unique: true,
    required: [true, 'Please enter an email'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: 'String',
    trim: true,
    required: [true, 'Please enter your first name']
  }
});

const User = mongoose.model('User', userSchema);

export default User;
