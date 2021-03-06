import { Document } from 'mongoose';
import { ObjectID } from 'bson';
import { CreateCollectionDto } from '@dtos/collections.dto';
import { HttpException } from '@exceptions/HttpException';
import { Collection } from '@interfaces/collections.interface';
import collectionModel from '@models/collections.model';
import flashcardsModel from '@models/flashcards.model';
import { Paginated } from '@interfaces/paginated.interface';

class CollectionService {
  public collections = collectionModel;
  public flashcards = flashcardsModel;

  public async findCollectionsByUserId(userId: ObjectID, page: number, perPage: number): Promise<Paginated<Collection>> {
    const collections: Collection[] = await this.collections.aggregate([
      {
        $match: { user: userId },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: (page - 1) * perPage,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: this.flashcards.collection.name,
          localField: '_id',
          foreignField: 'parent_collection',
          as: 'flashcards',
        },
      },
      {
        $set: {
          count: { $size: { $ifNull: ['$flashcards', []] } },
        },
      },
      {
        $unset: 'flashcards',
      },
    ]);

    const itemsCount = await this.collections.find({ user: { $eq: userId } }).count();

    return {
      items: collections,
      page: page,
      total_pages: Math.ceil(itemsCount / perPage),
      per_page: perPage,
      total_items_count: itemsCount,
    };
  }

  public async findCollectionById(userId: ObjectID, collectionId: ObjectID): Promise<Collection> {
    const collection: Collection = await this.collections.findById(collectionId);
    if (collection === null) throw new HttpException(404, 'Collection does not exist');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (!collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to view this collection');

    return collection;
  }

  public async createCollection(userId: ObjectID, collectionData: CreateCollectionDto): Promise<Collection> {
    return this.collections.create({ ...collectionData, user: userId });
  }

  public async updateCollection(userId: ObjectID, collectionId: ObjectID, collectionData: CreateCollectionDto): Promise<Collection> {
    const collection: Collection & Document = await this.collections.findById(collectionId);

    if (collection === null) throw new HttpException(404, 'Collection does not exist');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (!collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to modify this collection');

    Object.assign(collection, collectionData);
    await collection.save();

    return collection;
  }

  public async deleteCollection(userId: ObjectID, collectionId: ObjectID): Promise<Collection> {
    const collection: Collection & Document = await this.collections.findById(collectionId);

    if (collection === null) throw new HttpException(404, 'Collection does not exist');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (!collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to delete this collection');
    await collection.delete();

    return collection;
  }
}

export default CollectionService;
