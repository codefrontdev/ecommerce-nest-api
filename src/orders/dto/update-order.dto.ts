

import { CreateOrderDto } from "./create-order.dto";
import { PartialType } from '@nestjs/mapped-types';


export class UpdateOrdersDto extends PartialType (CreateOrderDto) {}
