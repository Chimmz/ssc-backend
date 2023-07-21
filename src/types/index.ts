import { Model, Document, HydratedDocument, Schema } from 'mongoose';

////////// USER SCHEMA ///////////////////////////////////////////
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

////////// EMAIL VERIFICATION SCHEMA /////////////////////////////////
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
  findByEmail(
    email: string
  ): Promise<HydratedDocument<EmailVerificationDocument, EmailVerificationMethods>>;

  removeVerificationsWithEmail(
    email: string
  ): Promise<HydratedDocument<EmailVerificationDocument, EmailVerificationMethods>>;
}

//////// EMAIL SUBSCRIBE SCHEMA ///////////////////////////////////
export interface EmailSubscriberDocument extends Document {
  email: string;
  createdAt: Date;
}

////////////// NEWS SCHEMA ////////////////////////////////////
export interface NewsDocument extends Document {
  headline: string;
  story: string;
  postedBy: Schema.Types.ObjectId;
  isApprovedByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface NewsMethods {}
// Statics
export interface NewsModel extends Model<NewsDocument, {}, NewsMethods> {}
