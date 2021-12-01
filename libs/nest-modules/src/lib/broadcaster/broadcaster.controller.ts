import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from '@project-lc/shared-types';
import { Broadcaster } from '.prisma/client';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  /** 방송인 회원가입 */
  @Post()
  public async signUp(@Body(ValidationPipe) dto: SignUpDto): Promise<Broadcaster> {
    const checkResult = await this.mailVerificationService.checkMailVerification(
      dto.email,
      dto.code,
    );

    if (!checkResult) {
      throw new BadRequestException('인증코드가 올바르지 않습니다.');
    }
    const broadcaster = await this.broadcasterService.signUp(dto);
    await this.mailVerificationService.deleteSuccessedMailVerification(dto.email);
    return broadcaster;
  }
}
