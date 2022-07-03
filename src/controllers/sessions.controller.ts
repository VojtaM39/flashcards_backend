import sessionService from '@services/sessions.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import { CreateSessionDto, UpdateSessionDto, UpdateSessionFlashCardStatDto } from '@dtos/sessions.dto';
import { Session } from '@interfaces/session.interface';
import { ObjectID } from 'bson';
import { HttpException } from '@exceptions/HttpException';
import { FlashCardSessionStat } from '@interfaces/flashcard_session_stat.interface';
import { FlashCard } from '@interfaces/flashcards.interface';
import { SessionReview } from '@interfaces/session_review.interface';

class SessionsController {
  public sessionService = new sessionService();

  public createSession = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const sessionData: CreateSessionDto = req.body;
      const createSessionData: Session = await this.sessionService.createSession(userId, sessionData);

      res.status(201).json({ data: createSessionData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateSession = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const sessionId: ObjectID = new ObjectID(req.params.id);
      const sessionData: UpdateSessionDto = req.body;
      const updateSessionData: Session = await this.sessionService.updateSession(userId, sessionId, sessionData);

      res.status(200).json({ data: updateSessionData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getSessionById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const sessionId: ObjectID = new ObjectID(req.params.id);
      const userId: ObjectID = req.user._id;
      const findSessionData: Session = await this.sessionService.findSessionById(userId, sessionId);

      res.status(200).json({ data: findSessionData, message: 'findById' });
    } catch (error) {
      next(error);
    }
  };

  public updateSessionFlashCardStat = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const updateSessionFlashCardStatData: UpdateSessionFlashCardStatDto = req.body;
      const userId: ObjectID = req.user._id;

      const flashCardSessionStatData: FlashCardSessionStat = await this.sessionService.updateSessionFlashCardStat(
        userId,
        updateSessionFlashCardStatData,
      );

      res.status(201).json({ data: flashCardSessionStatData, message: 'statUpdated' });
    } catch (error) {
      next(error);
    }
  };

  public getNextFlashcard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const sessionId: ObjectID = new ObjectID(req.params.id);

      const flashCardData: FlashCard = await this.sessionService.getSessionNextFlashcard(userId, sessionId);

      res.status(201).json({ data: flashCardData, message: 'nextFlashcard' });
    } catch (error) {
      next(error);
    }
  };

  public getSessionReview = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const sessionId: ObjectID = new ObjectID(req.params.id);

      const sessionReviewData: SessionReview = await this.sessionService.getSessionReview(userId, sessionId);

      res.status(200).json({ data: sessionReviewData, message: 'sessionReview' });
    } catch (error) {
      next(error);
    }
  };
}

export default SessionsController;
