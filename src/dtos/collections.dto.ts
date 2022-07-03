import { IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '@utils/cast';
import CollectionsConstants from '@/constants/collections.constants';

export class CreateCollectionDto {
  @IsString()
  @Length(3, 255)
  public name: string;
}

export class GetAuthCollectionsQueryDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  public page = 1;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1)
  @Max(CollectionsConstants.DEFAULT_COLLECTIONS_MAX_PER_PAGE)
  @IsOptional()
  public per_page = CollectionsConstants.DEFAULT_COLLECTIONS_COUNT_PER_PAGE;
}
