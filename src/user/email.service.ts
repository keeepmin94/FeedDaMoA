import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'naver',
      auth: {
        user: 'wonn23@naver.com',
        pass: 'erxvyubm813',
      },
    });
  }

  async sendVerificationToEmail(email: string, code: string): Promise<void> {
    const emailOptions: EmailOptions = {
      from: 'wonn23@naver.com',
      to: email,
      subject: '가입 인증 메일',
      html: `<h1> 인증 코드를 입력하면 가입 인증이 완료됩니다.</h1><br/>${code}`,
    };

    return await this.transporter.sendMail(emailOptions);
  }
}
