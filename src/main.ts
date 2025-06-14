import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.1.4:5173',
    'http://192.168.1.6:3000',
    'https://ecommerce-dash-app.netlify.app',
    'https://ecommerce-demo-v1.netlify.app',
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000, '0.0.0.0');
}
bootstrap();
