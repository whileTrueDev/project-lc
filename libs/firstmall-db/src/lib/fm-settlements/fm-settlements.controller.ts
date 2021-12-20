import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules';
import { BroadcasterSettlementTargetRes } from '@project-lc/shared-types';
import { FmSettlementService } from './fm-settlements.service';

@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@Controller('fm-settlements')
export class FmSettlementController {
  constructor(private readonly fmSettleService: FmSettlementService) {}

  @Get('targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllSettlementTargets(): Promise<any> {
    return this.fmSettleService.findAllSettleTargetList();
  }

  @Get('targets/broadcaster')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getBroadcasterSettlementTargets(): Promise<BroadcasterSettlementTargetRes> {
    return this.fmSettleService.findBcSettleTargetList();
  }
}
