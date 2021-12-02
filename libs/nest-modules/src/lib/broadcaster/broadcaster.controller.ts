import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  ValidationPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  CreateBroadcasterChannelDto,
  EmailDupCheckDto,
  SignUpDto,
} from '@project-lc/shared-types';
import { BroadcasterChannel } from '@prisma/client';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { Broadcaster } from '.prisma/client';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly channelService: BroadcasterChannelService,
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

  /** 방송인 이메일 주소 중복 체크 */
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.broadcasterService.isEmailDupCheckOk(dto.email);
  }

  /** 방송인 채널 생성 */
  @Post('/channel')
  createBroadcasterChannel(
    @Body(ValidationPipe) dto: CreateBroadcasterChannelDto,
  ): Promise<BroadcasterChannel> {
    return this.channelService.createBroadcasterChannel(dto);
  }

  /** 방송인 채널 삭제 */
  @Delete('/channel/:channelId')
  deleteBroadcasterChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
  ): Promise<boolean> {
    return this.channelService.deleteBroadcasterChannel(channelId);
  }

  /** 방송인 채널 목록 조회 */
  @Get('/:broadcasterId/channel-list')
  getBroadcasterChannelList(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterChannel[]> {
    return this.channelService.getBroadcasterChannelList(broadcasterId);
  }
}
