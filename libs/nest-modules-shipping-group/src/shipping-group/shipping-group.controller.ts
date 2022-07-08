import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { ShippingGroupDto } from '@project-lc/shared-types';
import { Seller, ShippingGroup } from '.prisma/client';
import {
  ShippingGroupListResult,
  ShippingGroupResult,
  ShippingGroupService,
} from './shipping-group.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('shipping-group')
@Controller('shipping-group')
export class ShippingGroupController {
  constructor(private readonly shippingGroupService: ShippingGroupService) {}

  // 배송비 그룹 상세보기 조회
  @Get('/:groupId')
  getOneShippingGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<ShippingGroupResult> {
    return this.shippingGroupService.getOneShippingGroup(groupId);
  }

  // 배송그룹 조회
  @Get()
  getShippingGroupList(
    @Query('sellerId', ParseIntPipe) sellerId: number,
  ): Promise<ShippingGroupListResult> {
    return this.shippingGroupService.getShippingGroupList(sellerId);
  }

  // 배송그룹 생성
  @Post()
  createShippingGroup(
    @SellerInfo() sellerInfo: UserPayload,
    @Body(ValidationPipe) dto: ShippingGroupDto,
  ): Promise<ShippingGroup & { seller: Seller }> {
    return this.shippingGroupService.createShippingGroup(sellerInfo.id, dto);
  }

  // 배송그룹 삭제
  @Delete()
  deleteShippingGroup(@Body('groupId', ParseIntPipe) groupId: number): Promise<boolean> {
    return this.shippingGroupService.deleteShippingGroup(groupId);
  }
}
