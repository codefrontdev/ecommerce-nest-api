import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { ParseUUIDPipe } from 'src/pipes/parse-uuid.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JWTPayloadType } from 'utils/types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture', maxCount: 1 }]),
  )
  async create(
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[] },
    @Body() createUserDto: CreateUserDto,
  ) {
    if (files?.profilePicture) {
      createUserDto.profilePicture = await this.cloudinaryService.upload(
        files.profilePicture[0],
        'users',
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query()
    query: {
      status?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(id: string) {
    return this.usersService.findOne(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER,
  )
  @UseInterceptors(FileInterceptor('profilePicture')) // لو فيه صورة
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JWTPayloadType,
  ) {
    if (file) {
      updateUserDto.profilePicture = await this.cloudinaryService.upload(
        file,
        'users',
      );
    }
    console.log('DTO in controller:', updateUserDto); // راقب هنا
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log('id', id);
    return this.usersService.remove(id);
  }
}
