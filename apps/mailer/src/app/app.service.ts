import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as dayjs from 'dayjs';
import { MailNoticeService } from '../lib/mail/mail-notice.service';
import { S3Service } from '../lib/s3/s3.service';
@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailNoticeService: MailNoticeService,
    private readonly s3Service: S3Service,
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

  private copyBroadcasterRow(targetMail): Promise<any> {
    return this.prisma
      .$executeRaw`INSERT INTO InactiveBroadcaster (id, email, userName, userNickname, overlayUrl, avatar, password)
    SELECT 
        id, email, userName, userNickname, overlayUrl,  avatar, password
    FROM 
        Broadcaster
    WHERE 
        email = ${targetMail};`;
  }

  private copySellerRow(targetMail): Promise<any> {
    return this.prisma
      .$executeRaw`INSERT INTO InactiveSeller (id, email, userName, avatar, password)
    SELECT 
      id, email, userName, avatar, password
    FROM 
        Broadcaster
    WHERE 
        email = ${targetMail};`;
  }

  private updateBroadcasterNull(targetMail): Promise<any> {
    return this.prisma.broadcaster.update({
      where: {
        email: targetMail,
      },
      data: {
        email: null,
        userName: null,
        overlayUrl: null,
        avatar: null,
        password: null,
        inactiveFlag: true,
      },
    });
  }

  private updateSellerNull(targetMail): Promise<any> {
    return this.prisma.seller.update({
      where: {
        email: targetMail,
      },
      data: {
        email: null,
        avatar: null,
        password: null,
        inactiveFlag: true,
      },
    });
  }

  async moveInactiveUserData(inactivateTarget): Promise<void> {
    if (inactivateTarget.userType === 'seller') {
      // s3 데이터 분리
      Promise.all([
        await this.copySellerRow(inactivateTarget.userEmail),
        this.updateSellerNull(inactivateTarget.userEmail),
        this.s3Service.moveObjects(
          'broadcaster-account-image',
          inactivateTarget.userEmail,
        ),
        this.s3Service.moveObjects('broadcaster-id-card', inactivateTarget.userEmail),
      ]);
    } else if (inactivateTarget.userType === 'broadcaster') {
      // s3 데이터 분리
      Promise.all([
        await this.copyBroadcasterRow(inactivateTarget.userEmail),
        this.updateBroadcasterNull(inactivateTarget.userEmail),
        this.s3Service.moveObjects('business-registration', inactivateTarget.userEmail),
        this.s3Service.moveObjects('settlement-account', inactivateTarget.userEmail),
        this.s3Service.moveObjects('mail-order', inactivateTarget.userEmail),
      ]);
    }
  }
}
