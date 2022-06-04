import { Collection } from '@interfaces/collections.interface';
import { ObjectID } from 'bson';

export interface FlashCard {
  _id: ObjectID;
  question: string;
  answer: string;
  parent_collection: ObjectID | Collection;
  createdAt: Date;
  updatedAt: Date;
}
