import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channel: Channel;

  constructor(@Inject('RABBITMQ_CONNECTION') private readonly connection: any) {
    this.connection.createChannel().then((channel) => {
      this.channel = channel;
      this.channel.assertQueue('deviceQueue', { durable: true });
    });
  }

  async sendMessage(queue: string, message: any) {
    const msg = JSON.stringify(message);
    this.channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
  }
}
