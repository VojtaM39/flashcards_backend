import flashCardModel from '@models/flashcards.model';
import collectionModel from '@models/collections.model';
import { HttpException } from '@exceptions/HttpException';
import { Document } from 'mongoose';
import { FlashCard } from '@interfaces/flashcards.interface';
import { isEmpty } from '@utils/util';
import { CreateFlashCardDto, UpdateFlashCardDto } from '@dtos/flashcards.dto';
import { Collection } from '@interfaces/collections.interface';
import { ObjectID } from 'bson';
import { Paginated } from '@interfaces/paginated.interface';

class FlashCardService {
  public flashCards = flashCardModel;
  public collections = collectionModel;

  public async findFlashCardById(flashCardId: ObjectID, userId: ObjectID): Promise<FlashCard> {
    const flashCard: FlashCard = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');
    if (flashCard.parent_collection instanceof ObjectID) throw new HttpException(400, 'Internal error');
    if (!(flashCard.parent_collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (flashCard.parent_collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to view this flashcard');

    return flashCard;
  }

  public async createFlashCard(userId: ObjectID, flashCardData: CreateFlashCardDto): Promise<FlashCard> {
    if (isEmpty(flashCardData)) throw new HttpException(400, "You're not flashCardData");

    const collection: Collection = await this.collections.findById(flashCardData.parent_collection);

    if (collection === null) throw new HttpException(400, 'Collection is non existent');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (!collection.user.equals(userId)) throw new HttpException(401, 'User is not owner of the collection');

    const createFlashCardData: FlashCard = await this.flashCards.create({ ...flashCardData });

    return createFlashCardData;
  }

  public async updateFlashCard(userId: ObjectID, flashCardId: ObjectID, flashCardData: UpdateFlashCardDto): Promise<FlashCard> {
    if (isEmpty(flashCardData)) throw new HttpException(400, "You're not flashCardData");

    const flashCard: FlashCard & Document = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');
    if (flashCard.parent_collection instanceof ObjectID) throw new HttpException(400, 'Internal error');
    if (!(flashCard.parent_collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (flashCard.parent_collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to modify this flashcard');

    Object.assign(flashCard, flashCardData);
    await flashCard.save();

    return flashCard;
  }

  public async deleteFlashCard(userId: ObjectID, flashCardId: ObjectID): Promise<FlashCard> {
    const flashCard: FlashCard & Document = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');
    if (flashCard.parent_collection instanceof ObjectID) throw new HttpException(400, 'Internal error');
    if (!(flashCard.parent_collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');

    if (flashCard.parent_collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to delete this flashcard');

    await flashCard.delete();

    return flashCard;
  }

  public async findFlashCardsByCollectionId(collectionId: ObjectID, userId: ObjectID, page: number, perPage: number): Promise<Paginated<FlashCard>> {
    const collection: Collection = await this.collections.findById(collectionId);

    if (collection === null) throw new HttpException(404, 'Collection does not exist');
    if (!(collection.user instanceof ObjectID)) throw new HttpException(400, 'Internal error');
    if (!collection.user.equals(userId)) throw new HttpException(401, 'You are not authorized to view this collection');

    const flashcards: FlashCard[] = await this.flashCards
      .find({ parent_collection: { $eq: collection._id } })
      .sort({ _id: -1 })
      .limit(perPage)
      .skip((page - 1) * perPage);

    const itemsCount = await this.flashCards.find({ parent_collection: { $eq: collection._id } }).count();

    const paginatedResult: Paginated<FlashCard> = {
      items: flashcards,
      page: page,
      total_pages: Math.ceil(itemsCount / perPage),
      per_page: perPage,
      total_items_count: itemsCount,
    };

    return paginatedResult;
  }
}

export default FlashCardService;
