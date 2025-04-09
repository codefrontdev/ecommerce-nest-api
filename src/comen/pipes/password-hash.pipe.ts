import { Injectable, PipeTransform } from "@nestjs/common";

import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
    async transform(value: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(value, salt);
    }
}