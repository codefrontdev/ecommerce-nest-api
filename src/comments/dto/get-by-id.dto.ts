import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetByIdDto {
  @IsNotEmpty({ message: 'id is required' })
  @IsUUID('all', { message: 'id must be a valid UUID' })
  id: string;
}
