import { Controller, Get } from '@nestjs/common';
import { KkshowBcList } from '@prisma/client';
import { KkshowBcListService } from './kkshow-bc-list.service';

@Controller('kkshow-bc-list')
export class KkshowBcListController {
  constructor(private readonly kkshowBcListService: KkshowBcListService) {}

  @Get()
  public getKkshowBcList(): Promise<KkshowBcList[]> {
    return this.kkshowBcListService.findAll();
  }
}
