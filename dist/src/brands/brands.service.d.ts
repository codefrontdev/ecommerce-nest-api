import { Repository } from 'typeorm';
import { GetByIdDto } from './dto/get-by-id.dto';
import { Brand } from './entites/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
export declare class BrandsService {
    private readonly brandRepository;
    private readonly cloudinaryService;
    constructor(brandRepository: Repository<Brand>, cloudinaryService: CloudinaryService);
    create(createbrandDto: CreateBrandDto): Promise<CreateBrandDto & Brand>;
    findAll(filter: {
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        brands: Brand[];
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
        data: Brand;
    }>;
    update({ id }: GetByIdDto, updatebrandDto: UpdateBrandDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
