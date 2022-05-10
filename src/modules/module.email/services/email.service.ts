import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { NodemailerEmailOptions } from '../interfaces/email.interfaces';
import { TransportObjectDataModel } from '../models/transport-object.dm';

@Service()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  public async sendEmail(to: string, subject: string, text: string) {
    const transportObject = new TransportObjectDataModel(to, subject, text);

    const result: NodemailerEmailOptions = await this.transporter.sendMail(
      transportObject
    );
  }
}
