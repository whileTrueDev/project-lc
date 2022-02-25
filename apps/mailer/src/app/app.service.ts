import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import dayjs from 'dayjs';
import { MailNoticeService } from '../lib/mail/mail-notice.service';
import { AppSellerService } from './app-seller.service';
import { AppBroadcasterService } from './app-broadcaster.service';

export type LastLoginDate = {
  userType: 'seller' | 'broadcaster';
  userEmail: string;
  timeDiff: number;
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailNoticeService: MailNoticeService,
    private readonly appSellerService: AppSellerService,
    private readonly appBroadcasterService: AppBroadcasterService,
  ) {}

  private logger: Logger = new Logger('MailerTaskService');

  getLastLoginDate(): Promise<LastLoginDate[]> {
    return this.prisma.$queryRaw`
      SELECT 
        t1.userType, t1.userEmail, DATEDIFF(CURDATE(), t1.createDate) as timeDiff
      FROM 
        LoginHistory AS t1 JOIN (
      SELECT 
        userEmail, MAX(createDate) AS createDate
      FROM 
        LoginHistory 
      GROUP BY 
        userEmail, userType
      ) a
      ON 
        t1.userEmail = a.userEmail 
      AND 
        t1.createDate = a.createDate
      WHERE 
        userType != "admin" 
      AND 
        DATEDIFF(CURDATE(), t1.createDate) = 335 
      OR 
        DATEDIFF(CURDATE(), t1.createDate) = 366;
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

  async moveInactiveUserData(inactivateTarget: LastLoginDate): Promise<void> {
    if (inactivateTarget.userType === 'seller') {
      try {
        this.appSellerService.moveSellerData(inactivateTarget.userEmail);
      } catch (err) {
        this.logger.error(err);
      }
    } else if (inactivateTarget.userType === 'broadcaster') {
      try {
        this.appBroadcasterService.moveBraodcasterData(inactivateTarget.userEmail);
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
