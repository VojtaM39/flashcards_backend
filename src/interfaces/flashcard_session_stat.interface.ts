import { FlashCard } from '@interfaces/flashcards.interface';
import { ObjectID } from 'bson';
import { Session } from '@interfaces/session.interface';

export interface FlashCardSessionStat {
  session: Session | ObjectID;
  flashcard: FlashCard | ObjectID;
  total: number;
  correct: number;
}
