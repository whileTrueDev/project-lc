import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BroadcasterChannel } from '@prisma/client';
import {
  BroadcasterInfo,
  CacheClearKeys,
  HttpCacheInterceptor,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MailVerificationService } from '@project-lc/nest-modules-mail-verification';
import {
  BroadcasterAddressDto,
  BroadcasterContractionAgreementDto,
  BroadcasterRes,
  ChangeNicknameDto,
  CreateBroadcasterChannelDto,
  EmailDupCheckDto,
  FindBroadcasterDto,
  PasswordValidateDto,
  SignUpDto,
} from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import { PrismaService } from '@project-lc/prisma-orm';
import __multer from 'multer';
import { Broadcaster, BroadcasterAddress } from '.prisma/client';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterSettlementInfoService } from './settlement-info/broadcaster-settlement-info.service';

@UseInterceptors(ClassSerializerInterceptor)
@CacheClearKeys('broadcaster')
@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly channelService: BroadcasterChannelService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly broadcasterContactsService: BroadcasterContactsService,
    private readonly broadcasterSettlementInfoService: BroadcasterSettlementInfoService,
    private readonly prismaService: PrismaService,
  ) {}

  /** 방송인 정보 조회 */
  @Get()
  @UseInterceptors(HttpCacheInterceptor)
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

  /** 휴면 방송인 계정 복구 */
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('channel-list', 'broadcaster/contacts', 'broadcaster/settlement-info')
  @Patch('restore')
  public async restoreInactiveBroadcaster(@Body(ValidationPipe) dto): Promise<void> {
    const broadcaster = await this.broadcasterService.restoreInactiveBroadcaster(
      dto.email,
    );

    try {
      await this.prismaService.$transaction(async (): Promise<void> => {
        Promise.all([
          this.broadcasterContactsService.restoreBroadcasterContacts(broadcaster.id),
          this.broadcasterService.restoreBroadcasterAddress(broadcaster.id),
          this.channelService.restoreBroadcasterChannel(broadcaster.id),
          this.broadcasterSettlementInfoService
            .restoreBroadcasterSettlement(broadcaster.id)
            .then((settlementInfo) => {
              if (settlementInfo) {
                this.broadcasterSettlementInfoService.restoreBroadcasterSettlementConfirmation(
                  settlementInfo.id,
                );
              }
            }),
          s3.moveObjects(
            'inactive-broadcaster-account-image',
            'broadcaster-account-image',
            dto.email,
          ),
          s3.moveObjects(
            'inactive-broadcaster-id-card',
            'broadcaster-id-card',
            dto.email,
          ),
        ]).then(async () => {
          await this.broadcasterService.deleteInactiveBroadcaster(broadcaster.id);
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /** 방송인 이메일 주소 중복 체크 */
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.broadcasterService.isEmailDupCheckOk(dto.email);
  }

  /** 방송인 채널 생성 */
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('channel-list')
  @UseGuards(JwtAuthGuard)
  @Post('/channel')
  createBroadcasterChannel(
    @Body(ValidationPipe) dto: CreateBroadcasterChannelDto,
  ): Promise<BroadcasterChannel> {
    return this.channelService.createBroadcasterChannel(dto);
  }

  /** 방송인 채널 삭제 */
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('channel-list')
  @UseGuards(JwtAuthGuard)
  @Delete('/channel/:channelId')
  deleteBroadcasterChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
  ): Promise<boolean> {
    return this.channelService.deleteBroadcasterChannel(channelId);
  }

  /** 방송인 채널 목록 조회 */
  @UseInterceptors(HttpCacheInterceptor)
  @Get('/:broadcasterId/channel-list')
  getBroadcasterChannelList(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterChannel[]> {
    return this.channelService.getBroadcasterChannelList(broadcasterId);
  }

  /** 방송인 활동명 수정 */
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('nickname')
  public async updateNickname(
    @BroadcasterInfo() bc: UserPayload,
    @Body(ValidationPipe) dto: ChangeNicknameDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.updateNickname(bc.id, dto.nickname);
  }

  /** 방송인 주소 수정 */
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('address')
  public async updateAddress(
    @BroadcasterInfo() bc: UserPayload,
    @Body(ValidationPipe) dto: BroadcasterAddressDto,
  ): Promise<BroadcasterAddress> {
    return this.broadcasterService.upsertAddress(bc.id, dto);
  }

  // 로그인 한 사람이 본인인증을 위해 비밀번호 확인
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<boolean> {
    return this.broadcasterService.checkPassword(dto.email, dto.password);
  }

  // 비밀번호 변경
  @UseInterceptors(HttpCacheInterceptor)
  @Patch('password')
  public async changePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.changePassword(dto.email, dto.password);
  }

  // 이용 동의 상태 변경
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('agreement')
  public async changeContractionAgreement(
    @Body(ValidationPipe) dto: BroadcasterContractionAgreementDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.changeContractionAgreement(dto);
  }

  /** 방송인 계정 삭제 */
  @UseInterceptors(HttpCacheInterceptor)
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

  /** 방송인 아바타 이미지 s3업로드 후 url 저장 */
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @BroadcasterInfo() broadcaster: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    return this.broadcasterService.addBroadcasterAvatar(broadcaster.sub, file);
  }

  /** 방송인 아바타 이미지 null로 저장 */
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('/avatar')
  async deleteAvatar(@BroadcasterInfo() broadcaster: UserPayload): Promise<boolean> {
    return this.broadcasterService.removeBroadcasterAvatar(broadcaster.sub);
  }
}
