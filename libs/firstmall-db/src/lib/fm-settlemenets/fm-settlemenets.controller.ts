import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules';
import { FmSettlementService } from './fm-settlements.service';

@Controller('fm-settlements')
export class FmSettlementController {
  constructor(private readonly fmSettleService: FmSettlementService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllSettlementTargets(): Promise<any> {
    return this.fmSettleService.findAllSettleTargetList();
  }
}
