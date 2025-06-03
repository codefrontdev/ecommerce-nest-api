import { Repository } from 'typeorm';
import { GetByIdDto } from './dto/get-by-id.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entites/category.entity';
export declare class categoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<CreateCategoryDto & Category>;
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
        categories: Category[];
        total: number;
        page: number;
        lastPage: number;
        currentPage: number;
        nextPage: number | null;
        pageSize: number;
        categoriestatusCounts: {
            available: number;
            disabled: number;
        };
    }>;
    findOne(id: string): Promise<{
        message: string;
        success: boolean;
        data: Category;
    }>;
    update({ id }: GetByIdDto, updateCategoryDto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
