import { Injectable } from '@nestjs/common';
import { MailVerificationCode } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class MailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

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
