import flashCardService from '@services/flashcards.service';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { FlashCard } from '@interfaces/flashcards.interface';
import { CreateFlashCardDto, GetFlashCardsByCollectionQueryDto, UpdateFlashCardDto } from '@dtos/flashcards.dto';
import { ObjectID } from 'bson';
import { Paginated } from '@interfaces/paginated.interface';
import { plainToInstance } from 'class-transformer';

class FlashCardsController {
  static readonly DEFAULT_FLASHCARDS_PER_PAGE = 30;

  public flashCardService = new flashCardService();

  public getFlashCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const flashCardId: ObjectID = new ObjectID(req.params.id);
      const userId: ObjectID = req.user._id;

      const findFlashCardData: FlashCard = await this.flashCardService.findFlashCardById(flashCardId, userId);

      res.status(200).json({ data: findFlashCardData, message: 'findById' });
    } catch (error) {
      next(error);
    }
  };

  public createFlashCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const flashCardData: CreateFlashCardDto = req.body;
      const createFlashCardData: FlashCard = await this.flashCardService.createFlashCard(userId, flashCardData);

      res.status(201).json({ data: createFlashCardData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateFlashCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const flashCardId: ObjectID = new ObjectID(req.params.id);
      const flashCardData: UpdateFlashCardDto = req.body;

      const updateFlashCardData: FlashCard = await this.flashCardService.updateFlashCard(userId, flashCardId, flashCardData);
      res.status(200).json({ data: updateFlashCardData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteFlashCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const flashCardId: ObjectID = new ObjectID(req.params.id);

      const deleteFlashCardData: FlashCard = await this.flashCardService.deleteFlashCard(userId, flashCardId);
      res.status(200).json({ data: deleteFlashCardData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getFlashCardsByCollection = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const collectionId: ObjectID = new ObjectID(req.params.id);
      const userId: ObjectID = req.user._id;
      const flashCardsByCollectionData: GetFlashCardsByCollectionQueryDto = plainToInstance(GetFlashCardsByCollectionQueryDto, req.query);
      console.log(flashCardsByCollectionData);

      const findFlashCardsByCollectionData: Paginated<FlashCard> = await this.flashCardService.findFlashCardsByCollectionId(
        collectionId,
        userId,
        flashCardsByCollectionData.page,
        flashCardsByCollectionData.per_page,
      );

      res.status(200).json({ data: findFlashCardsByCollectionData, message: 'findByCollectionId' });
    } catch (error) {
      next(error);
    }
  };
}

export default FlashCardsController;
