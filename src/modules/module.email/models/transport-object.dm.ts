import { NodemailerEmailOptions } from '../interfaces/email.interfaces';

export class TransportObjectDataModel implements NodemailerEmailOptions {
  public from: string = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
  public to: string;
  public subject: string;
  public text: string;
  public html?: string;

  constructor(to: string, subject: string, text: string, html?: string) {
    this.to = to;
    this.subject = subject;
    this.text = text;

    if (html) {
      this.html = html;
    }
  }
}
