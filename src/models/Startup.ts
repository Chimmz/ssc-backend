import mongoose, { Schema } from 'mongoose';
import { StartupDocument, StartupMethods, StartupModel } from '../types';
import { StartupIndustries, StartupStages } from '../utils/constants';

const startupSchema = new Schema<StartupDocument, StartupModel, StartupMethods>(
  {
    name: { type: String, index: 'text', unique: true, required: true },
    logoUrl: { type: String, required: true },
    industries: { type: [String], enum: StartupIndustries, required: true },
    stage: { type: String, enum: StartupStages, required: true },
    description: { type: String, maxlength: 500, index: 'text', required: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

startupSchema.index({ name: 'text', description: 'text' });
const Startup = mongoose.model<StartupDocument, StartupModel>('Startup', startupSchema);

export default Startup;
