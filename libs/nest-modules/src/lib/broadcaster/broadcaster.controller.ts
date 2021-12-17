import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BroadcasterChannel } from '@prisma/client';
import {
  BroadcasterAddressDto,
  BroadcasterContactDto,
  BroadcasterRes,
  ChangeNicknameDto,
  CreateBroadcasterChannelDto,
  EmailDupCheckDto,
  FindBCSettlementHistoriesRes,
  FindBroadcasterDto,
  SignUpDto,
} from '@project-lc/shared-types';
import { Broadcaster, BroadcasterAddress, BroadcasterContacts } from '.prisma/client';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterService } from './broadcaster.service';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';
import { BroadcasterInfo } from '../_nest-units/decorators/broadcasterInfo.decorator';
import { UserPayload } from '../..';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly contactsService: BroadcasterContactsService,
    private readonly channelService: BroadcasterChannelService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly settlementHistoryService: BroadcasterSettlementHistoryService,
  ) {}

  /** 방송인 정보 조회 */
  @Get()
  public async findBroadcaster(
    @Query(ValidationPipe) dto: FindBroadcasterDto,
  ): Promise<BroadcasterRes | null> {
    return this.broadcasterService.getBroadcaster(dto);
  }

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

  /** 방송인 활동명 수정 */
  @UseGuards(JwtAuthGuard)
  @Put('nickname')
  public async updateNickname(
    @Body(ValidationPipe) dto: ChangeNicknameDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.updateNickname(1, dto.nickname);
  }

  /** 방송인 연락처 목록 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('/contacts/:broadcasterId')
  public async findBroadcasterContacts(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterContacts[]> {
    return this.contactsService.findContacts(broadcasterId);
  }

  /** 방송인 연락처 생성 */
  @UseGuards(JwtAuthGuard)
  @Post('contacts')
  public async createContact(
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<BroadcasterContacts> {
    return this.contactsService.createContact(dto.broadcasterId, dto);
  }

  /** 방송인 연락처 수정 */
  @UseGuards(JwtAuthGuard)
  @Put('contacts/:contactId')
  public async updateContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<boolean> {
    return this.contactsService.updateContact(contactId, dto);
  }

  /** 방송인 연락처 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete('contacts/:contactId')
  public async deleteContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
  ): Promise<boolean> {
    return this.contactsService.deleteContact(contactId);
  }

  /** 방송인 주소 수정 */
  @UseGuards(JwtAuthGuard)
  @Put('address')
  public async updateAddress(
    @Body(ValidationPipe) dto: BroadcasterAddressDto,
  ): Promise<BroadcasterAddress> {
    return this.broadcasterService.upsertAddress(1, dto);
  }

  /** 방송인 정산 내역 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('settlement-history/:broacasterId')
  public async findSettlementHistories(
    @BroadcasterInfo() bc: UserPayload,
    @Param('broacasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
  ): Promise<FindBCSettlementHistoriesRes> {
    if (bc.id !== broadcasterId)
      throw new UnauthorizedException('본인 계정의 정산 내역만 조회할 수 있습니다.');
    return this.settlementHistoryService.findHistories(broadcasterId);
  }
}
