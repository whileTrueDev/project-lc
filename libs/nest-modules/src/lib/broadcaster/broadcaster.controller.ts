import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  BroadcasterContractionAgreementDto,
  BroadcasterRes,
  BroadcasterSettlementInfoDto,
  BroadcasterSettlementInfoRes,
  ChangeNicknameDto,
  CreateBroadcasterChannelDto,
  EmailDupCheckDto,
  FindBcSettlementHistoriesRes,
  FindBroadcasterDto,
  PasswordValidateDto,
  SignUpDto,
} from '@project-lc/shared-types';
import {
  Broadcaster,
  BroadcasterAddress,
  BroadcasterContacts,
  BroadcasterSettlementInfo,
} from '.prisma/client';
import { UserPayload } from '../..';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterInfo } from '../_nest-units/decorators/broadcasterInfo.decorator';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly contactsService: BroadcasterContactsService,
    private readonly channelService: BroadcasterChannelService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly settlementHistoryService: BroadcasterSettlementHistoryService,
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
  @UseGuards(JwtAuthGuard)
  @Post('/channel')
  createBroadcasterChannel(
    @Body(ValidationPipe) dto: CreateBroadcasterChannelDto,
  ): Promise<BroadcasterChannel> {
    return this.channelService.createBroadcasterChannel(dto);
  }

  /** 방송인 채널 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete('/channel/:channelId')
  deleteBroadcasterChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
  ): Promise<boolean> {
    return this.channelService.deleteBroadcasterChannel(channelId);
  }

  /** 방송인 채널 목록 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('/:broadcasterId/channel-list')
  getBroadcasterChannelList(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterChannel[]> {
    return this.channelService.getBroadcasterChannelList(broadcasterId);
  }

  /** 방송인 누적 정산 금액 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('/:broadcasterId/accumulated-settlement-amount')
  public async findAccumulatedSettlementAmount(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<number> {
    const acc = await this.settlementHistoryService.findAccumulatedSettlementAmount(
      broadcasterId,
    );
    return acc._sum.amount;
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
  ): Promise<FindBcSettlementHistoriesRes> {
    if (bc.id !== broadcasterId)
      throw new UnauthorizedException('본인 계정의 정산 내역만 조회할 수 있습니다.');
    return this.settlementHistoryService.findHistoriesByBroadcaster(broadcasterId);
  }

  // 로그인 한 사람이 본인인증을 위해 비밀번호 확인
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<boolean> {
    return this.broadcasterService.checkPassword(dto.email, dto.password);
  }

  // 비밀번호 변경
  @Patch('password')
  public async changePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.changePassword(dto.email, dto.password);
  }

  // 이용 동의 상태 변경
  @UseGuards(JwtAuthGuard)
  @Patch('agreement')
  public async changeContractionAgreement(
    @Body(ValidationPipe) dto: BroadcasterContractionAgreementDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.changeContractionAgreement(
      dto.email,
      dto.agreementFlag,
    );
  }

  /** 방송인 정산등록정보 등록 */
  @UseGuards(JwtAuthGuard)
  @Post('settlement-info')
  public async insertSettlementInfo(
    @Body(ValidationPipe) dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    return this.broadcasterSettlementService.insertSettlementInfo(dto);
  }

  /** 방송인 정산등록정보 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('settlement-info/:broadcasterId')
  public async selectBroadcasterSettlementInfo(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementInfoRes> {
    return this.broadcasterSettlementService.selectBroadcasterSettlementInfo(
      broadcasterId,
    );
  }

  /** 방송인 계정 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete()
  public async deleteBroadcaster(
    @Body('email') email: string,
    @BroadcasterInfo() broadcasterInfo: UserPayload,
  ): Promise<boolean> {
    if (email !== broadcasterInfo.sub) {
      throw new UnauthorizedException('본인의 계정이 아니면 삭제할 수 없습니다.');
    }
    return this.broadcasterService.deleteOne(email);
  }
}
