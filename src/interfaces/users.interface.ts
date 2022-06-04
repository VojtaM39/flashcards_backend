import { ObjectID } from 'bson';

export interface User {
  _id: ObjectID;
  email: string;
  password: string;
}
