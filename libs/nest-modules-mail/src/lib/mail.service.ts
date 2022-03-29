import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { createVerificationTemplate } from './templates/createVerificationTemplate';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * 이메일 인증을 위해, 인증코드를 포함한 메일을 타겟 이메일에 보냅니다.
   * @returns {boolean} 성공여부 or 500 에러
   */
  public async sendCodeVerificationMail(
    targetEmail: string,
    code: string,
  ): Promise<boolean> {
    try {
      this.logger.debug(`START: sendCodeVerificationMail - ${targetEmail}`);
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: `[크크쇼] ${code}은(는) 이메일 확인을 완료할 코드입니다.`,
        html: createVerificationTemplate(code),
      });
      this.logger.debug(`DONE: sendCodeVerificationMail - ${targetEmail}`);
      return true;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(e, 'error in send email');
    }
  }
}
