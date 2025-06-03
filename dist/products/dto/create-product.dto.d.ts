export declare class CreateProductDto {
    name: string;
    description: string;
    brandId: string;
    categoryId: string;
    tags: string[];
    shortDescription: string;
    status: string;
    visibility: string;
    publishDate: string;
    manufacturerName: string;
    manufacturerBrand: string;
    stock: number;
    price: number;
    discount: number;
    orders: number;
    image?: {
        url: string;
        publicId: string;
    };
    images?: {
        url: string;
        publicId: string;
    }[];
    colors?: string[];
    sizes?: string[];
    attributes?: string[];
    attributesValues?: string[];
}
