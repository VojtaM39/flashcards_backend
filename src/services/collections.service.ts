import { Document } from 'mongoose';
import { isEmpty } from '@utils/util';
import { CreateCollectionDto } from '@dtos/collections.dto';
import { HttpException } from '@exceptions/HttpException';
import { Collection } from '@interfaces/collections.interface';
import collectionModel from '@models/collections.model';

class CollectionService {
  public collections = collectionModel;

  public async findCollectionsByUserId(userId: string): Promise<Collection[]> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const collections: Collection[] = await this.collections.find({ user_id: userId });

    return collections;
  }

  public async createCollection(userId: string, collectionData: CreateCollectionDto): Promise<Collection> {
    if (isEmpty(collectionData)) throw new HttpException(400, "You're not collectionData");

    const createCollectionData: Collection = await this.collections.create({ ...collectionData, user_id: userId });

    return createCollectionData;
  }

  public async updateCollection(userId: string, collectionId: string, collectionData: CreateCollectionDto): Promise<Collection> {
    if (isEmpty(collectionData)) throw new HttpException(400, "You're not collectionData");

    const collection: Collection & Document = await this.collections.findById(collectionId);

    if (collection === null) throw new HttpException(404, 'Collection does not exist');

    if (!collection.user_id.equals(userId)) throw new HttpException(401, 'You are not authorized to modify this collection');

    Object.assign(collection, collectionData);
    await collection.save();

    return collection;
  }

  public async deleteCollection(userId: string, collectionId: string): Promise<Collection> {
    const collection: Collection & Document = await this.collections.findById(collectionId);

    if (collection === null) throw new HttpException(404, 'Collection does not exist');

    if (!collection.user_id.equals(userId)) throw new HttpException(401, 'You are not authorized to delete this collection');
    await collection.delete();

    return collection;
  }
}

export default CollectionService;
