import { Controller, Get } from '@nestjs/common';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { KkshowShoppingService } from './kkshow-shopping.service';

@Controller('kkshow-shopping')
export class KkshowShoppingController {
  constructor(private readonly kkshowShoppingService: KkshowShoppingService) {}

  @Get()
  getKkshowShoppingData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }
}
