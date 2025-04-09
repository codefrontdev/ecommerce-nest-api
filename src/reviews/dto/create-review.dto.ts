import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  userId: string;
}
