import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  SellerContactsDTO,
  SellerContactsDTOWithoutIdDTO,
} from '@project-lc/shared-types';
import { SellerContactsService } from './seller-contacts.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('seller/contacts')
@Controller('seller/contacts')
export class SellerContactsController {
  constructor(private readonly sellerContactsService: SellerContactsService) {}

  /** 판매자의 기본연락처 조회 */
  @UseGuards(JwtAuthGuard)
  @Get()
  public findDefaultContacts(@Query('email') email: string): Promise<SellerContactsDTO> {
    return this.sellerContactsService.findDefaultContacts(email);
  }

  /** 판매자 연락처 등록 */
  @UseGuards(JwtAuthGuard)
  @Post()
  public createContacts(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: SellerContactsDTOWithoutIdDTO,
  ): Promise<{ contactId: number }> {
    const sellerId = seller.id;
    return this.sellerContactsService.registSellerContacts(sellerId, dto);
  }
}
