import { NextFunction, Response } from 'express';
import { Collection } from '@interfaces/collections.interface';
import CollectionService from '@services/collections.service';
import { CreateCollectionDto, GetAuthCollectionsQueryDto } from '@dtos/collections.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { ObjectID } from 'bson';
import { HttpException } from '@exceptions/HttpException';
import { plainToInstance } from 'class-transformer';
import { Paginated } from '@interfaces/paginated.interface';

class CollectionsController {
  public collectionService = new CollectionService();

  public getMyCollections = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const authCollectionsData: GetAuthCollectionsQueryDto = plainToInstance(GetAuthCollectionsQueryDto, req.query);
      const findPaginatedUsersCollectionsData: Paginated<Collection> = await this.collectionService.findCollectionsByUserId(
        userId,
        authCollectionsData.page,
        authCollectionsData.per_page,
      );

      res.status(200).json({ data: findPaginatedUsersCollectionsData, message: 'findPaginatedByUser' });
    } catch (error) {
      next(error);
    }
  };

  public getCollection = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const collectionId: ObjectID = new ObjectID(req.params.id);
      const findCollectionData: Collection = await this.collectionService.findCollectionById(userId, collectionId);

      res.status(200).json({ data: findCollectionData, message: 'findById' });
    } catch (error) {
      next(error);
    }
  };

  public createCollection = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: ObjectID = req.user._id;
      const collectionData: CreateCollectionDto = req.body;
      const createCollectionData: Collection = await this.collectionService.createCollection(userId, collectionData);

      res.status(201).json({ data: createCollectionData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCollection = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const collectionId: ObjectID = new ObjectID(req.params.id);
      const collectionData: CreateCollectionDto = req.body;

      const updateCollectionData: Collection = await this.collectionService.updateCollection(userId, collectionId, collectionData);
      res.status(200).json({ data: updateCollectionData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCollection = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!ObjectID.isValid(req.params.id)) {
        next(new HttpException(400, 'Invalid ID'));
      }

      const userId: ObjectID = req.user._id;
      const collectionId: ObjectID = new ObjectID(req.params.id);

      const deleteCollectionData: Collection = await this.collectionService.deleteCollection(userId, collectionId);
      res.status(200).json({ data: deleteCollectionData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CollectionsController;
