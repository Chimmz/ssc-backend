import mongoose, { Schema } from 'mongoose';
import { StartupDocument, StartupMethods, StartupModel } from '../types';
import { StartupIndustries, StartupStages } from '../utils/constants';

const startupSchema = new Schema<StartupDocument, StartupModel, StartupMethods>(
  {
    name: { type: String, unique: true, required: true },
    logoUrl: { type: String, required: true },
    industries: { type: [String], required: true },
    stage: { type: String, enum: StartupStages, required: true },
    description: { type: String, maxlength: 1000, trim: true, required: true },
    email: { type: String, lowercase: true, trim: true, required: false },
    websiteUrl: { type: String, trim: true, required: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

startupSchema.index({ name: 'text', description: 'text' });
const Startup = mongoose.model<StartupDocument, StartupModel>('Startup', startupSchema);

export default Startup;
