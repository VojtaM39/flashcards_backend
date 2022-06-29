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
    infinite: {
      type: Boolean,
      required: false,
      default: false,
    },
    random: {
      type: Boolean,
      required: false,
      default: true,
    },
    correct: {
      type: Number,
      required: false,
      default: 0,
    },
    total: {
      type: Number,
      required: false,
      default: 0,
    },
    closed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

const sessionModel = model<Session & Document>('Session', sessionSchema);

export default sessionModel;
