import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    logo?: {
        publicId: string;
        url: string;
    };
}
