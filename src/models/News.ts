import mongoose, { Schema } from 'mongoose';
import { NewsDocument, NewsMethods, NewsModel } from '../types';

const newsSchema = new Schema<NewsDocument, NewsModel, NewsMethods>(
  {
    headline: {
      type: String,
      maxlength: 700,
      trim: true,
      required: [true, 'Please a headline for this news'],
      index: 'text'
    },
    story: { type: String, trim: true, index: 'text' },
    postedBy: {
      type: Schema.Types.ObjectId
      // required: [true, 'Please enter the body for this news']
    },
    isApprovedByAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

newsSchema.index({ headline: 'text', story: 'text' });
const News = mongoose.model<NewsDocument, NewsModel>('News', newsSchema);

export default News;
