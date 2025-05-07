import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  Repository,
} from 'typeorm';
import { GetByIdDto } from './dto/get-by-id.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entites/category.entity';

@Injectable()
export class categoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }
  async findAll(filter: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    color?: string;
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const {
      status,
      search,
      page = 1,
      pageSize = 10,
    } = filter;
    

    // حيث الشروط
    const whereConditions: any = {};

    if (status && status !== 'All') {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }


    // استرجاع المنتجات وعدد المنتجات لكل حالة
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // إحصاء الحالات (مثل available و disabled)
    const groupedCounts = await this.categoryRepository
      .createQueryBuilder('Category')
      .select('Category.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(whereConditions)
      .groupBy('Category.status')
      .getRawMany();

    const countsMap: Record<string, number> = {};
    groupedCounts.forEach((row) => {
      countsMap[row.status] = parseInt(row.count);
    });

    

    // إرجاع النتيجة
    return {
      message: 'categories found successfully',
      success: true,
      categories,
      total,
      page,
      lastPage: Math.ceil(total / pageSize),
      currentPage: page,
      nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
      pageSize,
      categoriestatusCounts: {
        available: countsMap['active'] || 0,
        disabled: countsMap['inactive'] || 0,
      },
    };
  }

  async findOne(id: string) {
    const Category = await this.categoryRepository.findOneBy({ id });

    if (!Category) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category found successfully',
      success: true,
      data: Category,
    };
  }

  update({ id }: GetByIdDto, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
   
    const deleted = await this.categoryRepository.delete(id);

    if (deleted.affected !== 1) {
      throw new BadRequestException('Category not Deleted');
    }

    return {
      message: 'Category deleted successfully',
      success: true,
    };
  }
}
