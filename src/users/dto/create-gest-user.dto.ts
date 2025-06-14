import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserGestDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  city?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('MA', { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  zip?: string;
}
