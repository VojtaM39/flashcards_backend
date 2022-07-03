import { Router } from 'express';
import SessionsController from '@controllers/sessions.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import { CreateSessionDto, UpdateSessionDto, UpdateSessionFlashCardStatDto } from '@dtos/sessions.dto';

class SessionsRoute implements Routes {
  public path = '/api/sessions';
  public router = Router();
  public sessionsController = new SessionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.sessionsController.getSessionById);
    this.router.post(this.path, [authMiddleware, validationMiddleware(CreateSessionDto, 'body')], this.sessionsController.createSession);
    this.router.put(`${this.path}/:id`, [authMiddleware, validationMiddleware(UpdateSessionDto, 'body')], this.sessionsController.updateSession);
    this.router.post(
      `${this.path}/flashcard-stat`,
      [authMiddleware, validationMiddleware(UpdateSessionFlashCardStatDto, 'body')],
      this.sessionsController.updateSessionFlashCardStat,
    );
    this.router.get(`${this.path}/flashcard/:id`, authMiddleware, this.sessionsController.getNextFlashcard);
    this.router.get(`${this.path}/review/:id`, authMiddleware, this.sessionsController.getSessionReview);
  }
}

export default SessionsRoute;
