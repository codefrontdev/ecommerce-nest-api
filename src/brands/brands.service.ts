import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GetByIdDto } from './dto/get-by-id.dto';
import { Brand } from './entites/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    
        private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createbrandDto: CreateBrandDto) {

    return this.brandRepository.save(createbrandDto);
  }
  async findAll(filter: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {  search, page = 1, pageSize = 10 } = filter;

    // حيث الشروط
    const whereConditions: any = {};


    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    // استرجاع المنتجات وعدد المنتجات لكل حالة
    const [brands, total] = await this.brandRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    


    // إرجاع النتيجة
    return {
      message: 'brands found successfully',
      success: true,
      brands,
      total,
      page,
      lastPage: Math.ceil(total / pageSize),
      currentPage: page,
      nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
      pageSize,
    };
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findOneBy({ id });

    if (!brand) {
      throw new NotFoundException('brand not found');
    }

    return {
      message: 'brand found successfully',
      success: true,
      data: brand,
    };
  }

  update({ id }: GetByIdDto, updatebrandDto: UpdateBrandDto) {
    return this.brandRepository.update(id, updatebrandDto);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    if (!brand.success) {
      throw new NotFoundException('brand not found');
    }

    if (brand?.data.logo) {
      await this.cloudinaryService.deleteImage(brand?.data.logo.publicId, 'brands');
    }

    const deleted = await this.brandRepository.delete(id);

    if (deleted.affected !== 1) {
      throw new BadRequestException('brand not Deleted');
    }

    return {
      message: 'brand deleted successfully',
      success: true,
    };
  }
}
