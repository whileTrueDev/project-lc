import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class MailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주어진 이메일과 인증코드가 실제 존재하는 지 체크합니다.
   * @param input Partial<{email: string; id: number}>
   */
  public async checkMailVerification(email: string, code: string): Promise<boolean> {
    const row = await this.prisma.mailVerificationCode.findFirst({
      where: {
        email,
        verificationCode: code,
      },
    });

    if (row) return true;
    return false;
  }
}
