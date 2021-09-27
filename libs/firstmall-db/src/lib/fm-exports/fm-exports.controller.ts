import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ExportBundledOrdersDto,
  ExportOrderDto,
  ExportOrdersDto,
  FindExportDto,
} from '@project-lc/shared-types';
import { JwtAuthGuard, SellerInfo, UserPayload } from '@project-lc/nest-modules';
import { FmExportsService } from './fm-exports.service';

@Controller('fm-exports')
@UseGuards(JwtAuthGuard)
export class FmExportsController {
  constructor(private readonly exportsService: FmExportsService) {}

  @Get(':exportCode')
  public findExports(@Param(ValidationPipe) dto: FindExportDto) {
    return this.exportsService.findOne(dto.exportCode);
  }

  @Post()
  public exportOrder(
    @Body(ValidationPipe) dto: ExportOrderDto,
    @SellerInfo() seller: UserPayload,
  ) {
    return this.exportsService.exportOrder(dto, seller.sub);
  }

  @Post('many')
  public exportOrders(
    @Body(ValidationPipe) dto: ExportOrdersDto,
    @SellerInfo() seller: UserPayload,
  ) {
    return this.exportsService.exportOrders(dto, seller.sub);
  }

  @Post('bundle')
  public exportBundledOrders(
    @Body(ValidationPipe) dto: ExportBundledOrdersDto,
    @SellerInfo() seller: UserPayload,
  ) {
    return this.exportsService.exportBundledOrders(dto, seller.sub);
  }
}
