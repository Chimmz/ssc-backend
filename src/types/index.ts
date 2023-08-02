import { Model, Document, HydratedDocument, Schema } from 'mongoose';
import { StartupIndustries, StartupStages } from '../utils/constants';

////////////////////// USER SCHEMA ///////////////////////////////
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
  findByEmail(email: string): Promise<HydratedDocument<UserDocument, UserMethods> | null>;
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

/////////////////// STARTUP MODEL /////////////////////////////////
// export type StartupIndustry =
//   | StartupIndustries.HEALTHCARE
//   | StartupIndustries.BLOCK_CHAIN
//   | StartupIndustries.E_COMMERCE
//   | StartupIndustries.FINANCIAL
//   | StartupIndustries.GAMING;

// export type StartupStage =
//   | StartupStages.SEED_STAGE
//   | StartupStages.GROWTH_STAGE
//   | StartupStages.IDEA_AND_CONCEPTUALIZATION
//   | StartupStages.EARLY_TRACTION
//   | StartupStages.PROOF_OF_CONCEPT
//   | StartupStages.EXPANSION_AND_MATURITY;

export interface StartupDocument extends Document {
  name: string;
  logoUrl: string;
  industries: StartupIndustries[];
  stage: StartupStages;
  description: string;
  email?: string;
  websiteUrl?: string;
  createdAt: Date;
}
export interface StartupMethods {}
// Statics
export interface StartupModel extends Model<StartupDocument, {}, StartupMethods> {}
