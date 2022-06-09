import sessionModel from '@models/sessions.model';
import collectionModel from '@models/collections.model';
import flashcardSessionStatModel from '@models/flashcard_session_stat.model';
import flashCardModel from '@models/flashcards.model';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { CreateSessionDto, UpdateSessionFlashCardStatDto } from '@dtos/sessions.dto';
import { Session } from '@interfaces/session.interface';
import { Collection } from '@interfaces/collections.interface';
import { FlashCardSessionStat } from '@interfaces/flashcard_session_stat.interface';
import { ObjectID } from 'bson';
import { Document } from 'mongoose';
import { FlashCard } from '@interfaces/flashcards.interface';

class SessionService {
  public sessions = sessionModel;
  public collections = collectionModel;
  public flashCardSessionStats = flashcardSessionStatModel;
  public flashCards = flashCardModel;

  public async createSession(userId: ObjectID, sessionData: CreateSessionDto): Promise<Session> {
    if (isEmpty(sessionData)) throw new HttpException(400, "You're not sessionData");

    const collection: Collection = await this.collections.findById(sessionData.flashcard_collection);

    if (collection == null) throw new HttpException(404, 'Non existent collection.');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');
    if (!collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to create session with this collection.');

    const createSessionData: Session = await this.sessions.create({ ...sessionData, user: userId, flashcard_stats: [] });

    return createSessionData;
  }

  public async findSessionById(userId: ObjectID, sessionId: ObjectID): Promise<Session> {
    const session: Session = await this.sessions.findById(sessionId);

    if (session === null) throw new HttpException(404, 'Session does not exist');
    if (!(session.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');
    if (!session.user.equals(userId)) throw new HttpException(401, 'You are not authorized to view this session');

    return session;
  }

  public async updateSessionFlashCardStat(
    userId: ObjectID,
    updateSessionFlashCardStatData: UpdateSessionFlashCardStatDto,
  ): Promise<FlashCardSessionStat> {
    if (!ObjectID.isValid(updateSessionFlashCardStatData.session)) throw new HttpException(400, 'Invalid session ID');
    if (!ObjectID.isValid(updateSessionFlashCardStatData.flashcard)) throw new HttpException(400, 'Invalid flashcard ID');

    const session: Session = await this.sessions.findById(updateSessionFlashCardStatData.session);

    if (session === null) throw new HttpException(404, 'Session does not exist');
    if (!(session.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');
    if (!session.user.equals(userId)) throw new HttpException(401, 'You are not authorized to change this session');

    let flashCardSessionStat: FlashCardSessionStat & Document = await this.flashCardSessionStats.findOne({
      session: updateSessionFlashCardStatData.session,
      flashcard: updateSessionFlashCardStatData.flashcard,
    });

    if (flashCardSessionStat === null) {
      flashCardSessionStat = new flashcardSessionStatModel();
      flashCardSessionStat.session = new ObjectID(updateSessionFlashCardStatData.session);
      flashCardSessionStat.flashcard = new ObjectID(updateSessionFlashCardStatData.flashcard);
      flashCardSessionStat.total = 0;
      flashCardSessionStat.correct = 0;
    }

    flashCardSessionStat.total += 1;
    if (updateSessionFlashCardStatData.correct) flashCardSessionStat.correct += 1;

    await flashCardSessionStat.save();

    return flashCardSessionStat;
  }

  public async getSessionNextFlashcard(userId: ObjectID, sessionId: ObjectID): Promise<FlashCard> {
    const session: Session = await this.sessions.findById(sessionId);

    if (session === null) throw new HttpException(404, 'Session does not exist');
    if (!(session.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');
    if (!session.user.equals(userId)) throw new HttpException(401, 'You are not authorized to view this session');

    const pipeline: Object[] = [
      {
        $match: { parent_collection: session.flashcard_collection },
      },
      {
        $lookup: {
          from: this.flashCardSessionStats.collection.name,
          as: 'stats',
          let: { flashcard_id: '$_id' },
          pipeline: [
            {
              $match: {
                $and: [{ $expr: { $eq: ['$session', session._id] } }, { $expr: { $eq: ['$flashcard', '$$flashcard_id'] } }],
              },
            },
          ],
        },
      },
      {
        $set: {
          stats: { $ifNull: [{ $arrayElemAt: ['$stats', 0] }, { _id: null, total: 0, correct: 0 }] },
        },
      },
    ];

    // Only flashcards, that have not been answered correctly yet
    if (!session.unlimited) pipeline.push({ $match: { 'stats.correct': 0 } });

    if (session.random) pipeline.push({ $sample: { size: 1 } });
    else pipeline.push({ $sort: { 'stats.total': 1, _id: 1 } });

    pipeline.push({ $limit: 1 });
    const result = await this.flashCards.aggregate(pipeline);

    if (result.length > 0) return result[0];

    return null;
  }
}

export default SessionService;