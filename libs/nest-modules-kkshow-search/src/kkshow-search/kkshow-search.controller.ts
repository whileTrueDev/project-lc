import { Controller, Get, Query } from '@nestjs/common';
import { KkshowSearchService } from './kkshow-search.service';

@Controller('search')
export class KkshowSearchController {
  constructor(private readonly kkshowSearchService: KkshowSearchService) {}

  @Get()
  getSearchResults(@Query('keyword') keyword: any): Promise<any> {
    return this.kkshowSearchService.searchResultPreprocessing(keyword);
  }
}
