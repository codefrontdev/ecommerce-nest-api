import { categoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetByIdDto } from './dto/get-by-id.dto';
export declare class categoriesController {
    private readonly categoriesService;
    constructor(categoriesService: categoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<CreateCategoryDto & import("./entites/category.entity").Category>;
    findAll(query: {
        status?: string;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        message: string;
        success: boolean;
        categories: import("./entites/category.entity").Category[];
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
        data: import("./entites/category.entity").Category;
    }>;
    update(id: GetByIdDto, updateCategoryDto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
