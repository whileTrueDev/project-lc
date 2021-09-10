import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, SellerInfo, UserPayload } from '@project-lc/nest-modules';
import { ShippingGroup } from '@project-lc/shared-types';
import { ShippingGroupService } from './shipping-group.service';

@UseGuards(JwtAuthGuard)
@Controller('shipping-group')
export class ShippingGroupController {
  constructor(private readonly shippingGroupService: ShippingGroupService) {}

  // 배송그룹 조회
  @Get()
  getShippingGroupList(@SellerInfo() sellerInfo: UserPayload) {
    return this.shippingGroupService.getShippingGroupList(sellerInfo.sub);
  }

  // 배송그룹 생성
  @Post()
  createShippingGroup(
    @SellerInfo() sellerInfo: UserPayload,
    // @Body(ValidationPipe) dto: ShippingGroup,
    // TODO: ValidationPipe 적용시 localhost:4200/login으로 리다이렉팅됨.. 밸리데이션 적용 필요(원인 아직 못찾음)
    @Body() dto: ShippingGroup,
  ) {
    return this.shippingGroupService.createShippingGroup(sellerInfo.sub, dto);
  }

  // 배송그룹 삭제
  @Delete()
  deleteShippingGroup(@Body('groupId', ParseIntPipe) groupId: number) {
    return this.shippingGroupService.deleteShippingGroup(groupId);
  }
}
