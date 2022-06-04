import { IsMongoId, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '@utils/cast';
import FlashcardsConstants from '@/constants/flashcards.constants';

export class CreateFlashCardDto {
  @IsString()
  public question: string;

  @IsString()
  public answer: string;

  @IsMongoId()
  public parent_collection: string;
}

export class UpdateFlashCardDto {
  @IsString()
  public question: string;

  @IsString()
  public answer: string;
}

export class GetFlashCardsByCollectionQueryDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  public page = 1;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  @Max(FlashcardsConstants.DEFAULT_FLASHCARDS_MAX_PER_PAGE)
  @IsOptional()
  public per_page = FlashcardsConstants.DEFAULT_FLASHCARDS_COUNT_PER_PAGE;
}
