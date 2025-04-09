import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPass = this.configService.get<string>('MAIL_PASS');
    const mailService = this.configService.get<string>('MAIL_SERVICE');

    this.transporter = nodemailer.createTransport({
      service: mailService,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });
  }

  async sendActivationEmail(email: string, activationCode: string) {
    await this.transporter.sendMail({
      from: `Ecommerce App <${this.configService.get<string>('MAIL_FROM')}>`,
      to: email,
      subject: 'Activate Your Account - Ecommerce App',
      text: `Your activation code is ${activationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Welcome to Ecommerce App!</h2>
          <p style="color: #555; font-size: 16px; text-align: center;">Thank you for signing up. To activate your account, please enter the activation code below in the activation page:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007BFF; background-color: #e7f3ff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              ${activationCode}
            </span>
          </div>

          <p style="color: #555; font-size: 16px; text-align: center;">Go to the activation page and enter this code to complete your registration.</p>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, you can ignore this email.</p>
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Ecommerce App. All rights reserved.</p>
        </div>
      `,
    });
  }
}
