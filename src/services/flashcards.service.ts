import flashCardModel from '@models/flashcards.model';
import collectionModel from '@models/collections.model';
import { HttpException } from '@exceptions/HttpException';
import { Document } from 'mongoose';
import { FlashCard } from '@interfaces/flashcards.interface';
import { isEmpty } from '@utils/util';
import { CreateFlashCardDto, UpdateFlashCardDto } from '@dtos/flashcards.dto';
import { Collection } from '@interfaces/collections.interface';

class FlashCardService {
  public flashCards = flashCardModel;
  public collections = collectionModel;

  public async findFlashCardById(flashCardId: string, userId: string): Promise<FlashCard> {
    const flashCard: FlashCard & Document = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');

    if (typeof flashCard.parent_collection === 'string') throw new HttpException(400, 'Internal error');

    if (!flashCard.parent_collection.user_id.equals(userId)) throw new HttpException(401, 'You are not authorized to view this flashcard');

    return flashCard;
  }

  public async createFlashCard(userId: string, flashCardData: CreateFlashCardDto): Promise<FlashCard> {
    if (isEmpty(flashCardData)) throw new HttpException(400, "You're not flashCardData");

    const collection: Collection = await this.collections.findById(flashCardData.parent_collection);

    if (collection === null) throw new HttpException(400, 'Collection is non existent');

    if (!collection.user_id.equals(userId)) throw new HttpException(401, 'User is not owner of the collection');

    const createFlashCardData: FlashCard = await this.flashCards.create({ ...flashCardData });

    return createFlashCardData;
  }

  public async updateFlashCard(userId: string, flashCardId: string, flashCardData: UpdateFlashCardDto): Promise<FlashCard> {
    if (isEmpty(flashCardData)) throw new HttpException(400, "You're not flashCardData");

    const flashCard: FlashCard & Document = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');

    if (typeof flashCard.parent_collection === 'string') throw new HttpException(400, 'Internal error');

    if (!flashCard.parent_collection.user_id.equals(userId)) throw new HttpException(401, 'You are not authorized to modify this flashcard');

    Object.assign(flashCard, flashCardData);
    await flashCard.save();

    return flashCard;
  }

  public async deleteFlashCard(userId: string, flashCardId: string): Promise<FlashCard> {
    const flashCard: FlashCard & Document = await this.flashCards.findById(flashCardId).populate('parent_collection');

    if (flashCard === null) throw new HttpException(404, 'Flashcard does not exist');

    if (typeof flashCard.parent_collection === 'string') throw new HttpException(400, 'Internal error');

    if (!flashCard.parent_collection.user_id.equals(userId)) throw new HttpException(401, 'You are not authorized to delete this flashcard');

    await flashCard.delete();

    return flashCard;
  }
}

export default FlashCardService;
