import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_MAILER_TOKEN } from '@project-lc/nest-core';
import { LastLoginDate, TargetUser } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';

@Injectable()
export class AppMailService {
  private logger: Logger = new Logger('MailerTaskService');

  constructor(
    @Inject(MICROSERVICE_MAILER_TOKEN) private readonly mailerClient: ClientProxy,
  ) {}

  private sendPreInactiveMail(user: TargetUser[]): Observable<void> {
    return this.mailerClient.send<void, TargetUser[]>('inactive-pre', user);
  }

  private sendInactiveMail(user: TargetUser[]): Observable<void> {
    return this.mailerClient.send<void, TargetUser[]>('inactive', user);
  }

  sendMail(mailTargets: LastLoginDate[]): void {
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
      this.sendPreInactiveMail(preInactiveList);
      this.logger.log(`예정 메일 발송 완료 ${preInactiveList.length}명`);
    }

    if (inactiveList.length !== 0) {
      this.sendInactiveMail(inactiveList);
      this.logger.log(`휴면 메일 발송 완료 ${inactiveList.length}명`);
    }
  }
}
