import { GetByIdDto } from './dto/get-by-id.dto';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
export declare class BrandsController {
    private readonly BrandsService;
    private readonly cloudinaryService;
    constructor(BrandsService: BrandsService, cloudinaryService: CloudinaryService);
    create(files: {
        logo?: Express.Multer.File[];
    }, createBrandDto: CreateBrandDto): Promise<CreateBrandDto & import("./entites/brand.entity").Brand>;
    findAll(query: {
        status?: string;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        brands: import("./entites/brand.entity").Brand[];
        total: number;
        page: number;
        lastPage: number;
        currentPage: number;
        nextPage: number | null;
        pageSize: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: import("./entites/brand.entity").Brand;
    }>;
    update(id: GetByIdDto, updateBrandDto: UpdateBrandDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
