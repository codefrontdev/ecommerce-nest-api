import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsUUID,
  IsArray,
  IsEmail,
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

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  userId?: string;
}
