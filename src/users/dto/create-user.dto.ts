import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/@core/utils/enums';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsOptional() // يسمح بأن تكون null أو undefined
  country?: string;

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

  @IsOptional() // يسمح بأن تكون null أو undefined
  @IsPhoneNumber('MA', { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional() // يسمح بأن تكون null أو undefined
  address?: string;

  @IsOptional()
  profilePicture?: {
    publicId: string;
    url: string;
  };
}
