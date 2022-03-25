import { Controller, Get } from '@nestjs/common';
import { KkshowSearchService } from './kkshow-search.service';

@Controller('search')
export class KkshowSearchController {
  constructor(private readonly kkshowSearchService: KkshowSearchService) {}

  @Get()
  getSearchResults(keyword): Promise<boolean> {
    return this.kkshowSearchService.search(keyword);
  }
}
