import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class CommentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}

export class CreateReviewDto {
  @IsInt()
  rating: number;

  @ValidateNested()
  @Type(() => CommentDto)
  comment: CommentDto;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
