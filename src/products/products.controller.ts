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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'src/@core/utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ParseUUIDPipe } from 'src/@core/pipes/parse-uuid.pipe';
import { GetByIdDto } from './dto/get-by-id.dto';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        fileFilter: (req, file, cb) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(file.mimetype)) {
            return cb(new BadRequestException('Invalid file type'), false);
          }
          cb(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit for each file
        },
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!files.image) {
      throw new BadRequestException('no file provided');
    }

    createProductDto.image = await this.cloudinaryService.upload(
      files.image[0],
      'products',
    );

    if (files.images) {
      createProductDto.images = await Promise.all(
        files.images.map((file) =>
          this.cloudinaryService.upload(file, 'products'),
        ),
      );
    }

    return await this.productsService.create(createProductDto);
  }

  @Get('')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query()
    query: {
      status?: string;
      search?: string;
      page?: number;
      pageSize?: number;
      color?: string;
      category?: string;
      sort?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    return this.productsService.findAll(query);
  }

  @Get('/status')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  statusAnalytics(): Promise<{ available: number; disabled: number }> {
    return this.productsService.findByStatusCount();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'image', maxCount: 1 },
          { name: 'images', maxCount: 10 },
        ],
        {
          fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.mimetype)) {
              return cb(new BadRequestException('Invalid file type'), false);
            }
            cb(null, true);
          },
          limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit for each file
          },
        },
      ),
    )
  async update(
    @Param('id', ParseUUIDPipe) id: GetByIdDto,
    @UploadedFiles() files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() updateUserDto: UpdateProductDto,
  ) {

    if (files.image) {
     const image = await this.cloudinaryService.upload(
        files.image[0],
        'products',
      );
      updateUserDto.image = image;
    }

    if (files.images) {
      const images = await Promise.all(
        files.images.map((file) =>
          this.cloudinaryService.upload(file, 'products'),
        ),
      );
      updateUserDto.images = images;
    }


    return this.productsService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
