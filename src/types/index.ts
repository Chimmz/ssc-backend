import { Model, Document, HydratedDocument } from 'mongoose';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
}

export interface UserMethods {
  verifyPassword(pwdInput: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument, {}, UserMethods> {
  someUserExistsWithEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<HydratedDocument<UserDocument, UserMethods>>;
  encryptPassword(pwd: string): Promise<string>;
  sendVerificationEmail(): Promise<void>;
}

////////// Email Verification Schema /////////////

export interface EmailVerificationDocument extends Document {
  email: string;
  createdAt: Date;
}

export interface EmailVerificationMethods {
  delete(): void;
  isExpired(): boolean;
}

// Statics
export interface EmailVerificationModel
  extends Model<EmailVerificationDocument, {}, EmailVerificationMethods> {
  // isUsedOrInvalid(): Promise<boolean>;
}
