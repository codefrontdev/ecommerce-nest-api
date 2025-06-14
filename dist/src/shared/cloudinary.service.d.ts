import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    upload(file: Express.Multer.File, folderName: string): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string, folderName?: string): Promise<boolean>;
}
