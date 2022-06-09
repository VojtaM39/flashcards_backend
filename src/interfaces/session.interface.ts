import { Collection } from '@interfaces/collections.interface';
import { User } from '@interfaces/users.interface';
import { ObjectID } from 'bson';

export interface Session {
  _id: ObjectID;
  user: User | ObjectID;
  flashcard_collection: Collection | ObjectID;
  random: Boolean;
  unlimited: Boolean;
  closed: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
