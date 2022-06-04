import { model, Schema, Document } from 'mongoose';
import { Collection } from '@interfaces/collections.interface';

const collectionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const collectionModel = model<Collection & Document>('Collection', collectionSchema);

export default collectionModel;
