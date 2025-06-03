import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseUUIDPipe } from 'src/pipes/parse-uuid.pipe';
import { GetByIdDto } from './dto/get-by-id.dto';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly BrandsService: BrandsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  async create(
    @UploadedFiles() files: { logo?: Express.Multer.File[] },
    @Body() createBrandDto: CreateBrandDto,
  ) {
    if (files?.logo) {
      createBrandDto.logo = await this.cloudinaryService.upload(
        files.logo[0],
        'brands',
      );
    }
    return await this.BrandsService.create(createBrandDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query()
    query: {
      status?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.BrandsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.BrandsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: GetByIdDto,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.BrandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.BrandsService.remove(id);
  }
}
