import { ObjectID } from 'bson';
import { User } from '@interfaces/users.interface';

export interface Collection {
  _id: ObjectID;
  user: ObjectID | User;
  name: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}
