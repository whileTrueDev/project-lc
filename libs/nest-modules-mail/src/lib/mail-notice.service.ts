import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import {
  createPreInactivateNoticeTemplate,
  createInactivateNoticeTemplate,
} from './templates/createInactivateNoticeTemplate';

@Injectable()
export class MailNoticeService {
  private readonly logger = new Logger(MailNoticeService.name);
  constructor(private readonly mailerService: MailerService) {}

  /** 휴면계정 전환 예정 이메일 발송 */
  public async sendPreInactivateMail(users: TargetUser[]): Promise<boolean> {
    try {
      this.logger.debug(`START: sendPreInactivateMail - ${users.join(',')}`);
      users.forEach(async (user) => {
        await this.mailerService.sendMail({
          to: user.userEmail,
          subject: `[크크쇼] 크크쇼 휴면 전환 예정 안내`,
          html: createPreInactivateNoticeTemplate(user),
        });
      });
      this.logger.debug(`DONE: sendPreInactivateMail - ${users.join(',')}`);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `Failed to send email - sendPreInactivateMail`,
      );
    }
  }

  /** 휴면 계정 전환 안내 메일 발송 */
  public async sendInactivateMail(users: TargetUser[]): Promise<boolean> {
    try {
      this.logger.debug(`START: sendInactivateMail - ${users.join(',')}`);
      users.forEach(async (user) => {
        await this.mailerService.sendMail({
          to: user.userEmail,
          subject: `[크크쇼] 크크쇼 휴면 전환 안내`,
          html: createInactivateNoticeTemplate(user),
        });
      });
      this.logger.debug(`DONE: sendInactivateMail - ${users.join(',')}`);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `Failed to send email - sendInactivateMail`,
      );
    }
  }
}
