import {
  Query,
  DefaultValuePipe,
  Controller,
  Get,
  Header,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import {
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  GoodsConfirmationDto,
} from '@project-lc/shared-types';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { AdminGuard } from '../_nest-units/guards/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo() {
    return this.adminService.getSettlementInfo();
  }

  // 상품검수를 위한 상품 리스트
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/goods')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getGoodsInfo(
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
  ) {
    return this.adminService.getGoodsInfo({
      sort,
      direction,
    });
  }

  // 상품 검수를 수행
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Put('/goods/confirm')
  setGoodsConfirmation(@Body() dto: GoodsConfirmationDto) {
    return this.adminService.setGoodsConfirmation(dto);
  }
}
