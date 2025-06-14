import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetByIdDto } from './dto/get-by-id.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
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
      color,
      category,
      sort,
      minPrice,
      maxPrice,
    } = filter;

    // حيث الشروط
    const whereConditions: any = {};

    if (status && status !== 'All') {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    if (color) {
      whereConditions.color = color;
    }

    if (category) {
      whereConditions.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      // استخدم Between إذا كانت كل من minPrice و maxPrice موجودتين
      whereConditions.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      // استخدم MoreThanOrEqual إذا كانت minPrice فقط موجودة
      whereConditions.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      // استخدم LessThanOrEqual إذا كانت maxPrice فقط موجودة
      whereConditions.price = LessThanOrEqual(maxPrice);
    }

    // استرجاع المنتجات وعدد المنتجات لكل حالة
    const [products, total] = await this.productRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['category', 'brand', 'reviews'],
    });

    // إحصاء الحالات (مثل available و disabled)
    const groupedCounts = await this.productRepository
      .createQueryBuilder('product')
      .select('product.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(whereConditions)
      .groupBy('product.status')
      .getRawMany();

    const countsMap: Record<string, number> = {};
    groupedCounts.forEach((row) => {
      countsMap[row.status] = parseInt(row.count);
    });

    // إرجاع النتيجة
    return {
      message: 'Products found successfully',
      success: true,
      products,
      total,
      totalPages: Math.ceil(total / pageSize),
      lastPage: Math.ceil(total / pageSize),
      currentPage: page,
      nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
      pageSize,
      productStatusCounts: {
        available: countsMap['available'] || 0,
        disabled: countsMap['disabled'] || 0,
      },
    };
  }

  async findByStatusCount(): Promise<{ available: number; disabled: number }> {
    const groupedCounts = await this.productRepository
      .createQueryBuilder('product')
      .select('product.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.status')
      .getRawMany();

    const countsMap: Record<string, number> = {};
    groupedCounts.forEach((row) => {
      countsMap[row.status] = parseInt(row.count);
    });

    return {
      available: countsMap['available'] || 0,
      disabled: countsMap['disabled'] || 0,
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.reviews', 'review')
      .leftJoinAndSelect('review.user', 'user')
      .addSelect([
        'review.id',
        'review.rating',
        'review.comment',
        'review.createdAt',
        'user.id',
        'user.firstName',
        'user.lastName',
      ])
      .where('product.id = :id', { id })
      .getOne();

      
      if (!product) {
        throw new NotFoundException('Product not found');
      }
     
    // Check if the product is disabled
    if (product.status === 'disabled') {
      throw new BadRequestException('Product is disabled');
    }

    return {
      message: 'Product found successfully',
      success: true,
      data: {
        ...product,
        reviews: product.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          user: {
            id: review.user.id,
            firstName: review.user.firstName,
            lastName: review.user.lastName,
            status: review.user.status,
            image: review.user.profilePicture,
          },
        })),
      },
    };
    
  }

  async update({ id }: GetByIdDto, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.data.image?.publicId) {
      this.cloudinaryService.deleteImage(
        product.data.image.publicId,
        'products',
      );
    }

    if (product.data.images) {
      product.data.images.forEach((image) => {
        this.cloudinaryService.deleteImage(image.publicId, 'products');
      });
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    const prod = await this.findOne(id);

    await this.cloudinaryService.deleteImage(id, 'products');
    if (prod.data.image?.publicId) {
      this.cloudinaryService.deleteImage(prod.data.image.publicId, 'products');
    }

    if (prod.data.images) {
      prod.data.images.forEach((image) => {
        this.cloudinaryService.deleteImage(image.publicId, 'products');
      });
    }
    const deleted = await this.productRepository.delete(id);

    if (deleted.affected !== 1) {
      throw new BadRequestException('Product not Deleted');
    }

    return {
      message: 'Product deleted successfully',
      success: true,
    };
  }
  updateStock(items: OrderItem[]) {
    for (const item of items) {
      this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ stock: item.quantity })
        .where('id = :id', { id: item.product.id })
        .execute();
    }
  }
}
