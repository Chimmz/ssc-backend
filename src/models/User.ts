import mongoose, { Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { UserDocument, UserMethods, UserModel } from '../types';

const userSchemaOptions: SchemaOptions<UserDocument, UserMethods> = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const userSchema = new Schema<UserDocument, UserModel, UserMethods>(
  {
    firstName: {
      type: String,
      maxlength: 50,
      trim: true,
      required: [true, 'Please enter your first name']
    },
    lastName: { type: String, maxlength: 40, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Please enter an email'],
      validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please enter your first name'],
      select: false
    },
    isEmailVerified: { type: Boolean, default: false }
  },
  userSchemaOptions
);

userSchema.statics.someUserExistsWithEmail = async function (
  email: string
): Promise<boolean> {
  return !!(await User.findOne({ email }));
};

userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};
userSchema.statics.encryptPassword = async function (password) {
  return await bcrypt.hash(password, 11);
};

userSchema.methods.verifyPassword = async function (pwdInput: string): Promise<boolean> {
  console.log('Comparing passwords: ', pwdInput, this);
  return await bcrypt.compare(pwdInput, this.password);
};

// userSchema.methods.sendVerificationEmail = async function (pwdInput: string): Promise<boolean> {
//   console.log('Comparing passwords: ', pwdInput, this);
//   return await bcrypt.compare(pwdInput, this.password);
// };

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 11);
  next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
