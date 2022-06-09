import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsMongoId()
  public flashcard_collection: string;

  @IsOptional()
  @IsBoolean()
  public unlimited: boolean;

  @IsOptional()
  @IsBoolean()
  public random: boolean;
}

export class UpdateSessionFlashCardStatDto {
  @IsMongoId()
  public session: string;

  @IsMongoId()
  public flashcard: string;

  @IsBoolean()
  public correct: boolean;
}
