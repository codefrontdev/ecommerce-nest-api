import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TirmPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value === 'string') value.trim();
    return value;
  }
}
