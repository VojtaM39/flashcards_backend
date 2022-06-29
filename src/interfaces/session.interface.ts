import { Collection } from '@interfaces/collections.interface';
import { User } from '@interfaces/users.interface';
import { ObjectID } from 'bson';

export interface Session {
  _id: ObjectID;
  user: User | ObjectID;
  flashcard_collection: Collection | ObjectID;
  random: Boolean;
  infinite: Boolean;
  closed: Boolean;
  correct: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
