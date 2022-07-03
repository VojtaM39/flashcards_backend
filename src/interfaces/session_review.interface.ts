import { ObjectID } from 'bson';
import { Session } from '@interfaces/session.interface';

export interface SessionReview {
  session: ObjectID | Session;
  learned_percentage: number;
}
