import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'ecommerce_db'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'], // ✅ تحميل الكيانات تلقائيًا
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // ✅ تحكم في `synchronize` من .env
        logging: configService.get<boolean>('DB_LOGGING', false), // ✅ تحكم في `logging` من .env
        ssl: false, // ✅ دعم SSL عند الحاجة
      }),
    }),
  ],
})
export class DatabaseModule {}
