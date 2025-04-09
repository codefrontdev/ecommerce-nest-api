import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Channel, Message, ConsumeMessage } from 'amqplib';
import { DeviceHistoryService } from 'src/deviceHistory/device-history.service';

@Injectable()
export class DeviceConsumerService {
  private channel: Channel;

  constructor(
    @Inject('RABBITMQ_CONNECTION') private readonly connection: any,
    private readonly deviceHistoryService: DeviceHistoryService,
  ) {
    this.connection.createChannel().then((channel) => {
      this.channel = channel;
      this.channel.assertQueue('deviceQueue', { durable: true });
      this.consumeMessages();
    });
  }

  private consumeMessages() {
    this.channel.consume('deviceQueue', async (msg: ConsumeMessage | null) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());

        // عملية تحقق الجهاز مثل إضافة سجل الجهاز
        await this.deviceHistoryService.createDeviceHistory(
          data.userId,
          data.ipAddress,
          data.userAgent,
          data.deviceType,
          data.os,
          data.browser,
          data.location,
        );

        // إرسال تأكيد المعالجة
        this.channel.ack(msg);
      }
    });
  }
}
