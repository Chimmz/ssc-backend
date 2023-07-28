import mongoose, { Schema } from 'mongoose';
import { StartupDocument, StartupMethods, StartupModel } from '../types';
import { StartupIndustries, StartupStages } from '../utils/constants';

const startupSchema = new Schema<StartupDocument, StartupModel, StartupMethods>(
  {
    name: { type: String, index: 'text' },
    logo: { type: String },
    industry: {
      enum: [
        StartupIndustries.HEALTHCARE,
        StartupIndustries.BLOCK_CHAIN,
        StartupIndustries.E_COMMERCE,
        StartupIndustries.FINANCIAL,
        StartupIndustries.GAMING
      ]
    },
    stage: {
      enum: [
        StartupStages.SEED_STAGE,
        StartupStages.GROWTH_STAGE,
        StartupStages.IDEA_AND_CONCEPTUALIZATION,
        StartupStages.EARLY_TRACTION,
        StartupStages.PROOF_OF_CONCEPT,
        StartupStages.EXPANSION_AND_MATURITY
      ]
    },
    description: { type: String, maxlength: 500, index: 'text' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

startupSchema.index({ name: 'text', description: 'text' });
const Startup = mongoose.model<StartupDocument, StartupModel>('Startup', startupSchema);

export default Startup;
