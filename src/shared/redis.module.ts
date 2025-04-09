import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS',
      useFactory: (configService: ConfigService) => {
        return new IORedis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: { rejectUnauthorized: false }, // 👈 ضروري لـ Upstash
          retryStrategy: (times) => Math.min(times * 50, 2000),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          reconnectOnError: (err) => {
            console.error('[REDIS ERROR]', err);
            return true;
          },
          keepAlive: 1,
          lazyConnect: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
