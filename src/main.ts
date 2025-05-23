import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './@core/pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.4:5173',
      'https://ecommerce-dash-app.netlify.app',
    ],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
