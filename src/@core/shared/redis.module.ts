import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS',
      useFactory: (configService: ConfigService) => {
        const redisUrl: string =
          configService.get<string>('REDIS_URL') ||
          'rediss://default:AcvOAAIjcDE4MTM0Mjc3NDgwM2E0MTE2YWExYTJmMDhjZTZjZTc3M3AxMA@precious-sturgeon-52174.upstash.io:6379';
        const redisClient = new IORedis(redisUrl, {
          tls: { rejectUnauthorized: false }, // ضروري مع Upstash
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
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject('REDIS') private readonly redisClient: IORedis) {}
  // تنفيذ اختبار الاتصال بعد تحميل الموديول
  async onModuleInit() {
    try {
      await this.redisClient.ping(); // إرسال ping للتحقق من الاتصال
      console.log('[REDIS] Redis is ready and connected');
    } catch (error) {
      console.error('[REDIS] Failed to connect to Redis:', error);
    }
  }
}
