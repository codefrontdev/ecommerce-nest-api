import { PipeTransform } from '@nestjs/common';
export declare class SanitizeHtmlPipe implements PipeTransform {
    transform(value: string): any;
}
