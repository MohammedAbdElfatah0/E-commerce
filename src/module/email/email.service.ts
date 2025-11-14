import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('email').user,
        pass: this.configService.get('email').password,
      },
    });
  }

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: `mohammed <${this.configService.get('email').user}>`,//check it 
      to,
      subject,
      html,
    });
  }
}