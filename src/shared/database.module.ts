import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DB_URL');

        return isProd
          ? {
              type: 'postgres',
              url: databaseUrl,
              ssl: { rejectUnauthorized: false },
              autoLoadEntities: true,
              synchronize: true, // ⛔️ لا تفعل هذا في الإنتاج
              logging: false,
            }
          : {
              type: 'postgres',
              host: configService.get<string>('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 5432),
              username: configService.get<string>('DB_USER', 'postgres'),
              password: configService.get<string>('DB_PASSWORD', 'password'),
              database: configService.get<string>('DB_NAME', 'ecommerce_db'),
              autoLoadEntities: true,
              synchronize: true,
              logging: true,
            };
      },
    }),
  ],
})
export class DatabaseModule {}
