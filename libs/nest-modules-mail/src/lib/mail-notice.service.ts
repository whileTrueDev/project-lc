import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailVerificationCode, Prisma, PrismaPromise } from '@prisma/client';
import { createPreInactivateNoticeTemplate } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class MailNoticeService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  public async sendPreInactivateMail(targetEmail: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: `[크크쇼] 크크쇼 휴면 전환 예정 안내`,
        html: createPreInactivateNoticeTemplate(targetEmail),
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }

  public async sendInactivateMail(targetEmail: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: `[크크쇼] 크크쇼 휴면 전환 안내`,
        html: createPreInactivateNoticeTemplate(targetEmail),
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }
}
