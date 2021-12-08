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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BroadcasterChannel } from '@prisma/client';
import {
  BroadcasterAddressDto,
  BroadcasterContactDto,
  BroadcasterRes,
  BroadcasterSettlementInfoDto,
  ChangeNicknameDto,
  CreateBroadcasterChannelDto,
  EmailDupCheckDto,
  FindBroadcasterDto,
  SignUpDto,
} from '@project-lc/shared-types';
import {
  Broadcaster,
  BroadcasterAddress,
  BroadcasterContacts,
  BroadcasterSettlementInfo,
} from '.prisma/client';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterService } from './broadcaster.service';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly contactsService: BroadcasterContactsService,
    private readonly channelService: BroadcasterChannelService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly broadcasterSettlementService: BroadcasterSettlementService,
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

  /** 방송인 정산정보 등록 */
  @Post('settlement-info')
  public async insertSettlementInfo(
    @Body(ValidationPipe) dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    return this.broadcasterSettlementService.insertSettlementInfo(dto);
  }

  /** 방송인 정산정보 조회 */
  @Get('settlement-info/:broadcasterId')
  public async selectBroadcasterSettlementInfo(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementInfo | null> {
    return this.broadcasterSettlementService.selectBroadcasterSettlementInfo(
      broadcasterId,
    );
  }
}
