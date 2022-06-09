import { Router } from 'express';
import CollectionsController from '@controllers/collections.controller';
import { Routes } from '@interfaces/routes.interface';
import { CreateCollectionDto } from '@dtos/collections.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class CollectionsRoute implements Routes {
  public path = '/api/collections';
  public router = Router();
  public collectionsController = new CollectionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user/me`, authMiddleware, this.collectionsController.getMyCollections);
    this.router.post(this.path, [authMiddleware, validationMiddleware(CreateCollectionDto, 'body')], this.collectionsController.createCollection);
    this.router.put(
      `${this.path}/:id`,
      [authMiddleware, validationMiddleware(CreateCollectionDto, 'body', true)],
      this.collectionsController.updateCollection,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.collectionsController.deleteCollection);
  }
}

export default CollectionsRoute;
