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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/entities/user.entity");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../shared/email.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const device_history_service_1 = require("../deviceHistory/device-history.service");
const device_utils_1 = require("../utils/device-utils");
const axios_1 = require("axios");
const rabbitmq_service_1 = require("../shared/rabbitmq.service");
const ioredis_1 = require("ioredis");
const enums_1 = require("../utils/enums");
let AuthService = class AuthService {
    userRepository;
    emailService;
    config;
    deviceHistory;
    jwtService;
    redisClient;
    rabbitMQService;
    authRepository;
    constructor(userRepository, emailService, config, deviceHistory, jwtService, redisClient, rabbitMQService, authRepository) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.config = config;
        this.deviceHistory = deviceHistory;
        this.jwtService = jwtService;
        this.redisClient = redisClient;
        this.rabbitMQService = rabbitMQService;
        this.authRepository = authRepository;
    }
    async signUp(signUpUserDto) {
        return this.userRepository.create(signUpUserDto);
    }
    async signIn(signInUserDto, req, res) {
        const user = await this.userRepository.findOneByEmail(signInUserDto.email);
        if (user.role === enums_1.UserRole.CUSTOMER) {
            throw new common_1.ForbiddenException('You are not allowed to access this resource');
        }
        await this.checkIfAlreadyLoggedIn(req, res);
        if (!(user?.password &&
            (await this.isPasswordValid(signInUserDto.password, user.password)))) {
            await this.userRepository.updateUser(user.id, {
                failedAttempts: user.failedAttempts + 1,
                lastFailedAttempt: new Date(),
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'inactive') {
            throw new common_1.ForbiddenException('Your account is not active');
        }
        const deviceInfo = await this.collectDeviceInfo(req, user);
        const { accessToken, refreshToken } = await this.createTokens(user, parseInt(req.ip || '0', 10) || null, deviceInfo.id);
        const isProduction = this.config.get('NODE_ENV') === 'production';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 1000 * 60 * 15,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        if (user.failedAttempts > 3) {
            const lockDuration = 15 * 60 * 1000;
            const lockUntil = new Date(Date.now() + lockDuration);
            await this.userRepository.updateUser(user.id, {
                failedAttempts: 0,
                lastFailedAttempt: lockUntil,
            });
            throw new common_1.UnauthorizedException('Your account is temporarily locked due to multiple failed login attempts. Please try again later.');
        }
        res.status(200).json({ message: 'Login successful', success: true });
    }
    async verifyToken(token) {
        const decoded = this.jwtService.verify(token, {
            secret: this.config.get('JWT_SECRET'),
        });
        if (!decoded) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const user = await this.userRepository.findOne(decoded.id);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.status === 'inactive') {
            throw new common_1.ForbiddenException('Your account is not active');
        }
        return { user, decoded };
    }
    async checkIfAlreadyLoggedIn(req, res) {
        const existingAccessToken = req.cookies['accessToken'];
        const existingRefreshToken = req.cookies['refreshToken'];
        if (existingAccessToken || existingRefreshToken) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
        }
    }
    async isPasswordValid(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }
    async prepareSessionTokens(req, user) {
        const deviceInfo = await this.collectDeviceInfo(req, user);
        return await this.createTokens(user, parseInt(req.ip || '0', 10) || null, deviceInfo.id);
    }
    async collectDeviceInfo(req, user) {
        const userAgent = req.headers['user-agent'] || '';
        const ipAddress = req.ip;
        const deviceType = device_utils_1.DeviceUtils.detectDeviceType(req);
        const os = device_utils_1.DeviceUtils.detectOperatingSystem(req);
        const browser = device_utils_1.DeviceUtils.detectBrowser(req);
        const location = await this.getGeolocation(ipAddress || '');
        const deviceHistory = await this.deviceHistory.createDeviceHistory(user, ipAddress || 'Unknown IP', userAgent, deviceType, os, browser, location);
        return deviceHistory;
    }
    async createTokens(user, ipAddress, deviceId) {
        const payload = {
            id: user.id,
            deviceId: deviceId.toString(),
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
            secret: this.config.get('JWT_SECRET'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN'),
            secret: this.config.get('JWT_SECRET'),
        });
        return { accessToken, refreshToken };
    }
    async refreshToken(refreshToken, res) {
        if (!refreshToken) {
            return { success: false };
        }
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_SECRET'),
            });
            const user = await this.userRepository.findOne(decoded.id);
            if (!user) {
                return { success: false };
            }
            const payload = {
                id: user.id,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
                secret: this.config.get('JWT_SECRET'),
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: this.config.get('NODE_ENV') === 'production',
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            return { success: true, accessToken, user };
        }
        catch (error) {
            return { success: false };
        }
    }
    async myAccount({ id }) {
        return this.userRepository.findOne(id);
    }
    signout(req, res) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logout successful' });
    }
    async sendDeviceData(message) {
        try {
            await this.rabbitMQService.sendMessage('deviceQueue', message);
        }
        catch (error) {
            console.error('Error sending device data to RabbitMQ:', error);
        }
    }
    async getGeolocation(ipAddress) {
        const cachedLocation = await this.redisClient.get(ipAddress);
        if (cachedLocation)
            return cachedLocation;
        try {
            const response = await axios_1.default.get(`${this.config.get('GEOLOCATION_API')}/?ip=${ipAddress}`);
            const { city, region, country } = response.data;
            const location = `${city}, ${region}, ${country}`;
            await this.redisClient.set(ipAddress, location, 'EX', 3600);
            return location;
        }
        catch (error) {
            console.error('Error fetching geolocation:', error);
            return 'Unknown location';
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)('REDIS')),
    __param(7, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        email_service_1.EmailService,
        config_1.ConfigService,
        device_history_service_1.DeviceHistoryService,
        jwt_1.JwtService,
        ioredis_1.Redis,
        rabbitmq_service_1.RabbitMQService,
        typeorm_1.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map