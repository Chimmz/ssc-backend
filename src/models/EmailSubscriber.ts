import mongoose, { Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { EmailSubscriberDocument, UserDocument, UserMethods, UserModel } from '../types';

const emailSubscriberSchema = new Schema<EmailSubscriberDocument>(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Please enter an email'],
      validate: [validator.isEmail, 'Please enter a valid email']
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const EmailSubscriber = mongoose.model<EmailSubscriberDocument>(
  'EmailSubscriber',
  emailSubscriberSchema
);

export default EmailSubscriber;
