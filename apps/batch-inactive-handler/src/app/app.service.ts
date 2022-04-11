import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { LastLoginDate } from '@project-lc/shared-types';
import { AppSellerService } from './app-seller.service';
import { AppBroadcasterService } from './app-broadcaster.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
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

  async moveInactiveUserData(inactivateTarget: LastLoginDate): Promise<void> {
    if (inactivateTarget.userType === 'seller') {
      try {
        await this.appSellerService.moveSellerData(inactivateTarget.userEmail);
      } catch (err) {
        this.logger.error(err);
      }
    } else if (inactivateTarget.userType === 'broadcaster') {
      try {
        await this.appBroadcasterService.moveBraodcasterData(inactivateTarget.userEmail);
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
