import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { BroadcasterContactDto } from '@project-lc/shared-types';
import { BroadcasterContacts } from '.prisma/client';
import { BroadcasterContactsService } from './broadcaster-contacts.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('broadcaster/contacts')
export class BroadcasterContactsController {
  constructor(private readonly contactsService: BroadcasterContactsService) {}

  /** 방송인 연락처 생성 */
  @Post()
  @CacheClearKeys('broadcaster/contacts')
  public async createContact(
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<BroadcasterContacts> {
    return this.contactsService.createContact(dto.broadcasterId, dto);
  }

  /** 방송인 연락처 목록 조회 */
  @Get(':broadcasterId')
  public async findBroadcasterContacts(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterContacts[]> {
    return this.contactsService.findContacts(broadcasterId);
  }

  /** 방송인 연락처 수정 */
  @Put(':contactId')
  @CacheClearKeys('broadcaster/contacts')
  public async updateContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
    @Body(ValidationPipe) dto: BroadcasterContactDto,
  ): Promise<boolean> {
    return this.contactsService.updateContact(contactId, dto);
  }

  /** 방송인 연락처 삭제 */
  @Delete(':contactId')
  @CacheClearKeys('broadcaster/contacts')
  public async deleteContact(
    @Param('contactId', ParseIntPipe) contactId: BroadcasterContacts['id'],
  ): Promise<boolean> {
    return this.contactsService.deleteContact(contactId);
  }
}
