import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetByIdDto } from './dto/get-by-id.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    create(files: {
        image?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }, createProductDto: CreateProductDto): Promise<CreateProductDto & import("./entities/product.entity").Product>;
    findAll(query: {
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
        products: import("./entities/product.entity").Product[];
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
    statusAnalytics(): Promise<{
        available: number;
        disabled: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: {
            reviews: {
                id: string;
                rating: number;
                comment: {
                    title: string;
                    body: string;
                    images?: string[];
                };
                createdAt: Date;
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    status: import("src/utils/enums").UserStatus;
                    image: {
                        publicId: string;
                        url: string;
                    };
                };
            }[];
            id: string;
            name: string;
            description: string;
            category: import("../categories/entites/category.entity").Category;
            categoryId: string;
            brand: import("../brands/entites/brand.entity").Brand;
            brandId: string;
            tags: string[];
            shortDescription: string;
            status: string;
            visibility: string;
            publishDate: Date;
            manufacturerName: string;
            manufacturerBrand: string;
            stock: number;
            price: number;
            discount: number;
            orders: number;
            image: {
                url: string;
                publicId: string | null;
            };
            images?: {
                url: string;
                publicId: string;
            }[];
            orderItems: import("../orders/entities/order-item.entity").OrderItem[];
            colors: string[];
            sizes: string[];
            attributes: string[];
            attributesValues: string[];
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: GetByIdDto, files: {
        image?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }, updateUserDto: UpdateProductDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
