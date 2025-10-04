// mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    void nodemailer.createTestAccount().then((testAccount) => {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    if (!this.transporter)
      throw new Error('Transporter ainda não inicializado');

    const info = await this.transporter.sendMail({
      from: `"Movies App" <no-reply@moviesapp.com>`,
      to,
      subject,
      text,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
