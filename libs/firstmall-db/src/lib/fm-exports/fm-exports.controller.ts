import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  ExportBundledOrdersDto,
  ExportOrderDto,
  ExportOrdersDto,
  FindExportDto,
  FmExportRes,
} from '@project-lc/shared-types';
import { FmExportsService } from './fm-exports.service';

@Controller('fm-exports')
@UseGuards(JwtAuthGuard)
export class FmExportsController {
  constructor(private readonly exportsService: FmExportsService) {}

  @Get(':exportCode')
  public findExports(@Param(ValidationPipe) dto: FindExportDto): Promise<FmExportRes> {
    return this.exportsService.findOne(dto.exportCode);
  }

  @Post()
  public exportOrder(
    @Body(ValidationPipe) dto: ExportOrderDto,
    @SellerInfo() seller: UserPayload,
  ): Promise<{
    orderId: string;
    exportCode: string;
  }> {
    return this.exportsService.exportOrder(dto, seller.id);
  }

  @Post('many')
  public exportOrders(
    @Body(ValidationPipe) dto: ExportOrdersDto,
    @SellerInfo() seller: UserPayload,
  ): Promise<boolean> {
    return this.exportsService.exportOrders(dto, seller.id);
  }

  @Post('bundle')
  public exportBundledOrders(
    @Body(ValidationPipe) dto: ExportBundledOrdersDto,
    @SellerInfo() seller: UserPayload,
  ): Promise<boolean> {
    return this.exportsService.exportBundledOrders(dto, seller.id);
  }
}
