"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../@core/utils/constants");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const user = request[constants_1.CURRENT_USER_KEY];
    if (!user) {
        return null;
    }
    return user;
});
//# sourceMappingURL=current-user.decorator.js.map