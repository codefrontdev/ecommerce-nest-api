import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/utils/enums';

export class CreateUserDto {
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

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsPhoneNumber('MA', { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  profilePicture?: {
    publicId: string;
    url: string;
  };
}
