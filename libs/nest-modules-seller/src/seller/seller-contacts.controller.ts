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
import { HttpCacheInterceptor, SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  SellerContactsDTO,
  SellerContactsDTOWithoutIdDTO,
} from '@project-lc/shared-types';
import { SellerContactsService } from './seller-contacts.service';

@Controller('seller/contacts')
export class SellerContactsController {
  constructor(private readonly sellerContactsService: SellerContactsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  public findDefaultContacts(@Query('email') email: string): Promise<SellerContactsDTO> {
    return this.sellerContactsService.findDefaultContacts(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public createContacts(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: SellerContactsDTOWithoutIdDTO,
  ): Promise<{ contactId: number }> {
    const email = seller.sub;
    return this.sellerContactsService.registSellerContacts(email, dto);
  }
}
