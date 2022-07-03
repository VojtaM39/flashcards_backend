import { IsString, Length } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @Length(3, 255)
  public name: string;
}
