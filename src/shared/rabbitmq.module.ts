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

        const connection = await amqp.connect(url, {
          timeout: 30000,
          heartbeat: 60,
          reconnect: true,
          servername: 'duck.lmq.cloudamqp.com', // ✅ تأكد أن اسم السيرفر صحيح
          rejectUnauthorized: false, // ✅ تعطيل التحقق من الشهادة (SSL)
        });

        return connection;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['RABBITMQ_CONNECTION'],
})
export class RabbitMQModule {}
