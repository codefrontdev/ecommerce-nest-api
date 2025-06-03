"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrdersDto = void 0;
const create_order_dto_1 = require("./create-order.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateOrdersDto extends (0, mapped_types_1.PartialType)(create_order_dto_1.CreateOrderDto) {
}
exports.UpdateOrdersDto = UpdateOrdersDto;
//# sourceMappingURL=update-order.dto.js.map