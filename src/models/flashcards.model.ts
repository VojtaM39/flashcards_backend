import { model, Schema, Document } from 'mongoose';
import { FlashCard } from '@interfaces/flashcards.interface';

const flashCardsSchema: Schema = new Schema(
  {
    parent_collection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Collection',
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const flashCardModel = model<FlashCard & Document>('FlashCard', flashCardsSchema);

export default flashCardModel;
