import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { ErrorCodes, InternalServerError } from '../../../core/errors';
import { logger } from '../../../core/utils';
import { EMAIL_RESULT_FAILED_MESSAGE } from '../constants/email-messages.constants';
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

  public async sendEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void> {
    const transportObject = new TransportObjectDataModel(to, subject, text);

    const result = await this.transporter.sendMail(transportObject);

    if (result) {
      logger.info(`Email sent ${result.messageId}`);
    } else {
      throw new InternalServerError(ErrorCodes.EMAIL_SENDER_ERROR, [
        EMAIL_RESULT_FAILED_MESSAGE,
      ]);
    }
  }
}
