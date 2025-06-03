import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isUUID } from "class-validator";

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
    transform(value: string) {
        if(!isUUID(value)) {
            throw new BadRequestException('Invalid UUID');
        }

        return value
    }
}