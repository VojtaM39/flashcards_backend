import mongoose from 'mongoose';

export interface Collection {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
