import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'RABBITMQ_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>(
          'RABBITMQ_URL',
          'amqp://localhost:5672',
        );

        try {
          const connection = await amqp.connect(url);
          console.log('✅ Connected to RabbitMQ');
          return connection;
        } catch (error) {
          console.error('❌ Failed to connect to RabbitMQ:', error);
          throw error;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['RABBITMQ_CONNECTION'],
})
export class RabbitMQModule {}
