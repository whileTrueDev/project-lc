import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import {
  createPreInactivateNoticeTemplate,
  createInactivateNoticeTemplate,
} from '../lib/mail-templates/createInactivateNoticeTemplate';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendPreInactivateMail(users: TargetUser[]): Promise<boolean> {
    try {
      users.forEach(async (user) => {
        await this.mailerService.sendMail({
          to: user.userEmail,
          subject: `[크크쇼] 크크쇼 휴면 전환 예정 안내`,
          html: createPreInactivateNoticeTemplate(user),
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in send email');
    }
  }

  public async sendInactivateMail(users: TargetUser[]): Promise<boolean> {
    try {
      users.forEach(async (user) => {
        await this.mailerService.sendMail({
          to: user.userEmail,
          subject: `[크크쇼] 크크쇼 휴면 전환 안내`,
          html: createInactivateNoticeTemplate(user),
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in send email');
    }
  }
}
