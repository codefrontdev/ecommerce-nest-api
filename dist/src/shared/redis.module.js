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
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisModule = class RedisModule {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async onModuleInit() {
        try {
            await this.redisClient.ping();
            console.log('[REDIS] Redis is ready and connected');
        }
        catch (error) {
            console.error('[REDIS] Failed to connect to Redis:', error);
        }
    }
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: 'REDIS',
                useFactory: (configService) => {
                    const redisUrl = configService.get('REDIS_URL') ||
                        'rediss://default:AcvOAAIjcDE4MTM0Mjc3NDgwM2E0MTE2YWExYTJmMDhjZTZjZTc3M3AxMA@precious-sturgeon-52174.upstash.io:6379';
                    const redisClient = new ioredis_1.default(redisUrl, {
                        tls: { rejectUnauthorized: false },
                        retryStrategy: (times) => Math.min(times * 50, 2000),
                        maxRetriesPerRequest: null,
                        enableReadyCheck: false,
                        reconnectOnError: (err) => {
                            console.error('[REDIS ERROR]', err);
                            return true;
                        },
                        lazyConnect: true,
                    });
                    redisClient.on('connect', () => {
                        console.log('[REDIS] Connected successfully');
                    });
                    redisClient.on('error', (err) => {
                        console.error('[REDIS] Connection error:', err);
                    });
                    return redisClient;
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: ['REDIS'],
    }),
    __param(0, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisModule);
//# sourceMappingURL=redis.module.js.map