import { OnModuleInit } from '@nestjs/common';
import IORedis from 'ioredis';
export declare class RedisModule implements OnModuleInit {
    private readonly redisClient;
    constructor(redisClient: IORedis);
    onModuleInit(): Promise<void>;
}
