import { Document } from 'mongoose';
import { isEmpty } from '@utils/util';
import { CreateCollectionDto } from '@dtos/collections.dto';
import { HttpException } from '@exceptions/HttpException';
import { Collection } from '@interfaces/collections.interface';
import collectionModel from '@models/collections.model';
import flashcardsModel from '@models/flashcards.model';
import { ObjectID } from 'bson';

class CollectionService {
  public collections = collectionModel;
  public flashcards = flashcardsModel;

  public async findCollectionsByUserId(userId: ObjectID): Promise<Collection[]> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const collections: Collection[] = await this.collections.aggregate([
      {
        $match: { user: userId },
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

    return collections;
  }

  public async createCollection(userId: ObjectID, collectionData: CreateCollectionDto): Promise<Collection> {
    if (isEmpty(collectionData)) throw new HttpException(400, "You're not collectionData");

    const createCollectionData: Collection = await this.collections.create({ ...collectionData, user: userId });

    return createCollectionData;
  }

  public async updateCollection(userId: ObjectID, collectionId: ObjectID, collectionData: CreateCollectionDto): Promise<Collection> {
    if (isEmpty(collectionData)) throw new HttpException(400, "You're not collectionData");

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
