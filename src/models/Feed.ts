import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeed extends Document {
  image: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  isVideo?: boolean;
  overlay?: string;
  tags?: string[];
  aspectRatio: number;
}

const FeedSchema: Schema<IFeed> = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    avatar: { type: String, required: true },
    likes: { type: Number, default: 0 },
    isVideo: { type: Boolean, default: false },
    overlay: { type: String },
    tags: [{ type: String }],
    aspectRatio: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

const Feed: Model<IFeed> = mongoose.models.Feed || mongoose.model<IFeed>('Feed', FeedSchema);

export default Feed;
