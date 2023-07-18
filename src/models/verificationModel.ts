import mongoose, { Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import {
  EmailVerificationDocument,
  EmailVerificationMethods,
  EmailVerificationModel
} from '../types';

const emailVerificationSchemaOptions: SchemaOptions<
  EmailVerificationDocument,
  EmailVerificationMethods
> = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const emailVerificationSchema = new Schema<
  EmailVerificationDocument,
  EmailVerificationModel,
  EmailVerificationMethods
>({ email: String }, emailVerificationSchemaOptions);

emailVerificationSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};

emailVerificationSchema.methods.isExpired = function () {
  // If time elapsed since creation is more than 1 day
  return (Date.now() - +new Date(this.createdAt)) / (1000 * 60 * 60 * 24) >= 1.0;
};

const EmailVerification = mongoose.model<EmailVerificationDocument, EmailVerificationModel>(
  'EmailVerification',
  emailVerificationSchema
);

export default EmailVerification;
