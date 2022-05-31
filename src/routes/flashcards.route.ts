import { Router } from 'express';
import FlashCardsController from '@controllers/flashcards.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import { CreateFlashCardDto, UpdateFlashCardDto } from '@dtos/flashcards.dto';

class FlashcardsRoute implements Routes {
  public path = '/api/flashcards';
  public router = Router();
  public flashCardsController = new FlashCardsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.flashCardsController.getFlashCard);
    this.router.post(this.path, [authMiddleware, validationMiddleware(CreateFlashCardDto, 'body')], this.flashCardsController.createFlashCard);
    this.router.put(
      `${this.path}/:id`,
      [authMiddleware, validationMiddleware(UpdateFlashCardDto, 'body', true)],
      this.flashCardsController.updateFlashCard,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.flashCardsController.deleteFlashCard);
  }
}

export default FlashcardsRoute;
