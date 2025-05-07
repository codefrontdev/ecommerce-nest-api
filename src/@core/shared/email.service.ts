import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    
     const host = this.configService.get<string>('EMAIL_SMTP_SERVER');
     const port = this.configService.get<number>('EMAIL_SMTP_PORT');
     const secure = this.configService.get<string>('EMAIL_SECURE') === 'true';
     const user = this.configService.get<string>('EMAIL_SENDER');
     const pass = this.configService.get<string>('EMAIL_PASSWORD');

     console.log({ host, port, secure, user }); // تأكيد التحميل

     this.transporter = nodemailer.createTransport({
       host,
       port,
       secure,
       auth: { user, pass },
     });
    
    
  }

  async sendActivationEmail(email: string, activationCode: string) {
    await this.transporter.sendMail({
      from: `Ecommerce App <${this.configService.get<string>('EMAIL_SENDER')}>`,
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
  async sendInvoice(invoiceData: {
    email: string;
    message: string;
    attachPdf?: boolean;
    pdfBuffer?: string;
    date: Date;
    invoiceNumber: string;
    status: string;
  }) {
    const { email, message, attachPdf, pdfBuffer , date, invoiceNumber, status } = invoiceData;
const htmlMessage = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fdfdfd;">
    <h2 style="color: #333;">Invoice from Ecommerce App</h2>
    <p style="font-size: 16px; color: #555;">
      Dear Customer,
    </p>
    <p style="font-size: 16px; color: #555;">
      Thank you for your recent purchase. Please find your invoice attached below. If you have any questions regarding this invoice, feel free to contact us.
    </p>

    <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #007BFF;">
      <strong>Invoice Details:</strong>
      <ul style="padding-left: 20px; margin: 10px 0; color: #333;">
        <li>Date: ${date}</li>
        <li>Status: <span style="color: green;">${status}</span></li>
        <li>Invoice Number: #INV-${invoiceNumber}</li>
      </ul>
    </div>

    <p style="font-size: 16px; color: #555;">
      You can keep this email for your records.
    </p>

    <p style="font-size: 14px; color: #999;">
      Regards,<br>
      Ecommerce App Team
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      &copy; ${new Date().getFullYear()} Ecommerce App. All rights reserved.
    </p>
  </div>
`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `Ecommerce App <${this.configService.get<string>('EMAIL_SENDER')}>`,
      to: email,
      subject: 'Invoice from Ecommerce App',
      text: message,
      html: htmlMessage,
    };
    console.log({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<string>('MAIL_PORT'),
      secure: this.configService.get<string>('MAIL_SECURE'),
    });

    if (attachPdf && pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: 'invoice.pdf',
          content: Buffer.from(pdfBuffer, 'base64'), // ← التحويل هنا
          contentType: 'application/pdf',
        },
      ];
    }
    console.log(mailOptions);
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(info);
    } catch (error) {
      console.log(error);
    }

  }
}
