import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as dayjs from 'dayjs';
import { MailNoticeService } from '../lib/mail-notice.service';
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
      .$queryRaw`SELECT t1.userType, t1.userEmail, DATEDIFF(CURDATE(), t1.createDate) as timeDiff
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
    const daysInKorean = ['일', '월', '화', '수', '목', '금', '토'];
    const inactivateDate = dayjs().add(31, 'day');
    const inactivateDateWithDayInKorean = `${inactivateDate.format('YYYY-MM-DD')} (${
      daysInKorean[inactivateDate.day()]
    })`;
    mailTargets.forEach((user) =>
      user.timeDiff === 335
        ? this.mailNoticeService.sendPreInactivateMail({
            userEmail: user.userEmail,
            inactivateDate: inactivateDateWithDayInKorean,
            userType: user.userType,
          })
        : this.mailNoticeService.sendInactivateMail({
            userEmail: user.userEmail,
            userType: user.userType,
          }),
    );
  }

  moveInactiveUserData(inactivateTarget): void {
    console.log(inactivateTarget.userEmail);
    // 휴면 계정 데이터들 옮기는 작업 여기서
  }
}
