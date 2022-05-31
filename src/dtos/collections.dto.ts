import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  public name: string;
}
