import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { UserPayload } from '../auth/auth.interface';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
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
    @Body() dto: ShippingGroupDto,
  ) {
    return this.shippingGroupService.createShippingGroup(sellerInfo.sub, dto);
  }

  // 배송그룹 삭제
  @Delete()
  deleteShippingGroup(@Body('groupId', ParseIntPipe) groupId: number) {
    return this.shippingGroupService.deleteShippingGroup(groupId);
  }
}
