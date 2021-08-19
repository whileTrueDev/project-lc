import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailVerificationCode } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { nanoid } from 'nanoid';
import { createVerificationTemplate } from '../../mail-templates/createVerificationTemplate';

@Injectable()
export class MailVerificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 이메일 인증 코드를 생성합니다.
   * @param target 타겟 이메일 주소
   * @returns 생성된 이메일 인증 코드
   */
  private async createEmailCode(target: string): Promise<string> {
    const code = nanoid(6);
    await this.prisma.mailVerificationCode.create({
      data: {
        email: target,
        verificationCode: code,
      },
    });
    return code;
  }

  /**
   * 이메일 인증을 위해, 인증코드를 포함한 메일을 타겟 이메일에 보냅니다.
   * @returns {boolean} 성공여부 or 500 에러
   */
  public async sendVerificationMail(targetEmail: string): Promise<boolean> {
    const code = await this.createEmailCode(targetEmail);

    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: `${code}은(는) 이메일 확인을 완료할 코드입니다.`,
        html: createVerificationTemplate(code),
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }

  /**
   * 주어진 이메일과 인증코드가 실제 존재하는 지 체크합니다.
   * @param input Partial<{email: string; id: number}>
   */
  public async checkMailVerification(
    email: string,
    code: string,
  ): Promise<MailVerificationCode> {
    const targetTime = new Date();
    targetTime.setMinutes(-10);
    const row = await this.prisma.mailVerificationCode.findFirst({
      orderBy: { createDate: 'desc' },
      where: {
        email,
        verificationCode: code,
        createDate: {
          gt: targetTime,
        },
      },
    });

    return row;
  }

  /**
   * 메일인증을 삭제합니다. 회원가입이 완료된 이후 진행하여야 합니다.
   * @param id 삭제할 메일 인증의 고유 아이디
   */
  public deleteSuccessedMailVerification(email: MailVerificationCode['email']) {
    return this.prisma.mailVerificationCode.deleteMany({ where: { email } });
  }
}
