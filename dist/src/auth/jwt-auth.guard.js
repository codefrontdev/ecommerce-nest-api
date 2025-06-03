"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../@core/utils/constants");
const auth_service_1 = require("./auth.service");
const core_1 = require("@nestjs/core");
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    authService;
    constructor(reflector, authService) {
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = request.res;
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || roles.length === 0) {
            return false;
        }
        const accessToken = request.cookies['accessToken'];
        const refreshToken = request.cookies['refreshToken'];
        if (!accessToken) {
            return false;
        }
        if (!refreshToken) {
            return false;
        }
        try {
            const result = await this.authService.verifyToken(accessToken);
            if (!result) {
                return false;
            }
            const { decoded, user } = result;
            if (!decoded || !user) {
                return false;
            }
            if (roles.includes(user.role)) {
                request[constants_1.CURRENT_USER_KEY] = decoded;
                return true;
            }
            return false;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError' && refreshToken) {
                try {
                    const result = await this.authService.refreshToken(refreshToken, response);
                    if (result.success && result.accessToken) {
                        const recheck = await this.authService.verifyToken(result.accessToken);
                        if (!recheck)
                            return false;
                        const { decoded, user } = recheck;
                        if (roles.includes(user.role)) {
                            request[constants_1.CURRENT_USER_KEY] = decoded;
                            return true;
                        }
                        return false;
                    }
                    else {
                        throw new common_1.UnauthorizedException('Refresh token is invalid');
                    }
                }
                catch (refreshError) {
                    throw new common_1.UnauthorizedException('Refresh token expired');
                }
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_service_1.AuthService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map