import { model, Schema, Document } from 'mongoose';
import { Session } from '@interfaces/session.interface';

const sessionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    flashcard_collection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Collection',
    },
    unlimited: {
      type: Boolean,
      required: false,
      default: false,
    },
    random: {
      type: Boolean,
      required: false,
      default: true,
    },
    max_seen: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  { timestamps: true },
);

const sessionModel = model<Session & Document>('Session', sessionSchema);

export default sessionModel;
