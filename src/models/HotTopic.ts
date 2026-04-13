import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHotTopic extends Document {
  rank: number;
  title: string;
  description: string;
  image: string;
  heat: number;
  tag?: string;
  isNew?: boolean;
  isHot?: boolean;
}

const HotTopicSchema: Schema<IHotTopic> = new Schema(
  {
    rank: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    heat: { type: Number, required: true },
    tag: { type: String },
    isNew: { type: Boolean, default: false },
    isHot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const HotTopic: Model<IHotTopic> = mongoose.models.HotTopic || mongoose.model<IHotTopic>('HotTopic', HotTopicSchema);

export default HotTopic;
