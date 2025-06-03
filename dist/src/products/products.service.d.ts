import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetByIdDto } from './dto/get-by-id.dto';
import { CloudinaryService } from 'src/@core/shared/cloudinary.service';
export declare class ProductsService {
    private readonly productRepository;
    private readonly cloudinaryService;
    constructor(productRepository: Repository<Product>, cloudinaryService: CloudinaryService);
    create(createProductDto: CreateProductDto): Promise<CreateProductDto & Product>;
    findAll(filter: {
        status?: string;
        search?: string;
        page?: number;
        pageSize?: number;
        color?: string;
        category?: string;
        sort?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        message: string;
        success: boolean;
        products: Product[];
        total: number;
        totalPages: number;
        lastPage: number;
        currentPage: number;
        nextPage: number | null;
        pageSize: number;
        productStatusCounts: {
            available: number;
            disabled: number;
        };
    }>;
    findByStatusCount(): Promise<{
        available: number;
        disabled: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: Product;
    }>;
    update({ id }: GetByIdDto, updateProductDto: UpdateProductDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
