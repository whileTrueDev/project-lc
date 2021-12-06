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
  ValidationPipe,
} from '@nestjs/common';
import {
  BroadcasterContactDto,
  ChangeNicknameDto,
  EmailDupCheckDto,
  FindBroadcasterDto,
  SignUpDto,
} from '@project-lc/shared-types';
import { Broadcaster, BroadcasterContacts } from '.prisma/client';
import { MailVerificationService } from '../auth/mailVerification.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly contactsService: BroadcasterContactsService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  /** 방송인 정보 조회 */
  @Get()
  public async findBroadcaster(
    @Query(ValidationPipe) dto: FindBroadcasterDto,
  ): Promise<Broadcaster | null> {
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

  @Put('nickname')
  public async updateNickname(
    @Body(ValidationPipe) dto: ChangeNicknameDto,
  ): Promise<Broadcaster> {
    return this.broadcasterService.updateNickname(1, dto.nickname);
  }

  /** 방송인 연락처 목록 조회 */
  @Get('/contacts/:broadcasterId')
  public async findBroadcasterContacts(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterContacts[]> {
    return this.contactsService.findContacts(broadcasterId);
  }

  /** 방송인 연락처 생성 */
  @Post('contacts')
  public async createContact(
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<BroadcasterContacts> {
    return this.contactsService.createContact(dto.broadcasterId, dto);
  }

  /** 방송인 연락처 수정 */
  @Put('contacts/:contactId')
  public async updateContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<boolean> {
    return this.contactsService.updateContact(contactId, dto);
  }

  /** 방송인 연락처 삭제 */
  @Delete('contacts/:contactId')
  public async deleteContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
  ): Promise<boolean> {
    return this.contactsService.deleteContact(contactId);
  }
}
