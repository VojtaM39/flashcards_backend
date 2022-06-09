import { Collection } from '@interfaces/collections.interface';
import { User } from '@interfaces/users.interface';
import { ObjectID } from 'bson';

export interface Session {
  _id: ObjectID;
  user: User | ObjectID;
  flashcard_collection: Collection | ObjectID;
  max_seen: Number;
  random: Boolean;
  unlimited: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
