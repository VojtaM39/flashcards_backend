import { model, Schema, Document } from 'mongoose';
import { FlashCardSessionStat } from '@interfaces/flashcard_session_stat.interface';

const flashcardSessionStat: Schema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Session',
    },
    flashcard: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Flashcard',
    },
    total: {
      type: Number,
      required: true,
    },
    correct: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
const flashcardSessionStatModel = model<FlashCardSessionStat & Document>('FlashCardSessionStat', flashcardSessionStat);

export default flashcardSessionStatModel;
