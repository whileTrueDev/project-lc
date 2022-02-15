import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  createPreInactivateNoticeTemplate,
  createInactivateNoticeTemplate,
} from './mail-templates/createInactivateNoticeTemplate';

@Injectable()
export class MailNoticeService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendPreInactivateMail(targetDetails): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: targetDetails.userEmail,
        subject: `[크크쇼] 크크쇼 휴면 전환 예정 안내`,
        html: createPreInactivateNoticeTemplate(targetDetails),
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }

  public async sendInactivateMail(targetDetails): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: targetDetails.userEmail,
        subject: `[크크쇼] 크크쇼 휴면 전환 안내`,
        html: createInactivateNoticeTemplate(targetDetails),
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }
}
