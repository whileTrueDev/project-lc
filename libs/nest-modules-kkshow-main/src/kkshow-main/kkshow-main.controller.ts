import { Controller, Get } from '@nestjs/common';
import { KkshowMainResData } from '@project-lc/shared-types';
import { KkshowMainService } from './kkshow-main.service';

@Controller('kkshow-main')
export class KkshowMainController {
  constructor(private readonly kkshowMainService: KkshowMainService) {}

  @Get()
  getKkshowMainData(): Promise<KkshowMainResData | null> {
    return this.kkshowMainService.read();
  }
}
