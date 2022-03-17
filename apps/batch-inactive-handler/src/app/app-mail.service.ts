import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { getMailerHost } from '@project-lc/utils';
import { TargetUser, LastLoginDate } from '@project-lc/shared-types';

@Injectable()
export class AppMailService {
  constructor(private readonly httpService: HttpService) {}
  private logger: Logger = new Logger('MailerTaskService');
  private HOST: string = getMailerHost();

  private async sendPreInactiveMail(user: TargetUser[]): Promise<void> {
    await lastValueFrom(
      this.httpService
        .post(`${this.HOST}/inactive-pre`, user)
        .pipe(map((res) => res.data)),
    );
  }

  private async sendInactiveMail(user: TargetUser[]): Promise<void> {
    await lastValueFrom(
      this.httpService.post(`${this.HOST}/inactive`, user).pipe(map((res) => res.data)),
    );
  }

  async sendMail(mailTargets: LastLoginDate[]): Promise<void> {
    const daysInKorean = ['일', '월', '화', '수', '목', '금', '토'];
    const inactivateDate = dayjs().add(31, 'day');
    const inactivateDateWithDayInKorean = `${inactivateDate.format('YYYY-MM-DD')} (${
      daysInKorean[inactivateDate.day()]
    })`;
    const preInactiveList: TargetUser[] = [];
    const inactiveList: TargetUser[] = [];

    if (mailTargets) {
      mailTargets.forEach((user) =>
        user.timeDiff === 335
          ? preInactiveList.push({
              userEmail: user.userEmail,
              inactivateDate: inactivateDateWithDayInKorean,
              userType: user.userType,
            })
          : inactiveList.push({
              userEmail: user.userEmail,
              userType: user.userType,
            }),
      );
    }

    if (preInactiveList.length !== 0) {
      await this.sendPreInactiveMail(preInactiveList);
      this.logger.log(`예정 메일 발송 완료 ${preInactiveList.length}명`);
    }

    if (inactiveList.length !== 0) {
      await this.sendInactiveMail(inactiveList);
      this.logger.log(`휴면 메일 발송 완료 ${inactiveList.length}명`);
    }
  }
}
