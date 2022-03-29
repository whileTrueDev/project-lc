import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LastLoginDate, TargetUser } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';

@Injectable()
export class AppMailService {
  private logger: Logger = new Logger('MailerTaskService');

  constructor(@Inject('MAILER_MQ') private readonly mailerClient: ClientProxy) {}

  private sendPreInactiveMail(user: TargetUser[]): Observable<void> {
    return this.mailerClient.send<void, TargetUser[]>('inactive-pre', user);
    // await lastValueFrom(
    //   this.httpService
    //     .post(`${this.HOST}/inactive-pre`, user)
    //     .pipe(map((res) => res.data)),
    // );
  }

  private sendInactiveMail(user: TargetUser[]): Observable<void> {
    return this.mailerClient.send<void, TargetUser[]>('inactive', user);
    // await lastValueFrom(
    //   this.httpService.post(`${this.HOST}/inactive`, user).pipe(map((res) => res.data)),
    // );
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
