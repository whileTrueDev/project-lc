import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { MailNoticeService } from '@project-lc/nest-modules-mail';
@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailNoticeService: MailNoticeService,
  ) {}

  getHello(): string {
    return 'Hello world!';
  }

  getLastLoginDate(): Promise<any> {
    return this.prisma
      .$queryRaw`SELECT t1.userEmail, DATEDIFF(CURDATE(), t1.createDate) as timeDiff
    FROM LoginHistory AS t1 JOIN (
    SELECT userEmail, MAX(createDate) AS createDate
    FROM LoginHistory 
    GROUP BY userEmail
    ) a
    ON t1.userEmail = a.userEmail 
    AND t1.createDate = a.createDate
    WHERE userType != "admin" 
    AND DATEDIFF(CURDATE(), t1.createDate) = 335 
    OR DATEDIFF(CURDATE(), t1.createDate) = 366;
    `;
  }

  sendMail(mailTargets): void {
    mailTargets.forEach((user) =>
      user.timeDiff === 335
        ? this.mailNoticeService.sendPreInactivateMail(user.userEmail)
        : this.mailNoticeService.sendInactivateMail(user.userEmail),
    );
  }

  moveInactiveUserData(inactivateTarget): void {
    console.log(inactivateTarget.userEmail);
    // 휴면 계정 데이터들 옮기는 작업 여기서
  }
}
