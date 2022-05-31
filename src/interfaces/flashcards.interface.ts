import { Collection } from '@interfaces/collections.interface';

export interface FlashCard {
  _id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  parent_collection: Collection | string;
}
