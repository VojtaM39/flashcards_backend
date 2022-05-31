import { IsMongoId, IsString } from 'class-validator';

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
