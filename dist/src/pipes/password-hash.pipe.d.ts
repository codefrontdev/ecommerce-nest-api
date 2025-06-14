import { PipeTransform } from "@nestjs/common";
export declare class PasswordHashPipe implements PipeTransform {
    transform(value: string): Promise<string>;
}
