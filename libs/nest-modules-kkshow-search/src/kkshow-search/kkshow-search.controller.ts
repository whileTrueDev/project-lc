import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchKeyword, SearchResult } from '@project-lc/shared-types';
import { KkshowSearchService } from './kkshow-search.service';

@Controller('search')
export class KkshowSearchController {
  constructor(private readonly kkshowSearchService: KkshowSearchService) {}

  @Get()
  getSearchResults(@Query(ValidationPipe) keyword: SearchKeyword): Promise<SearchResult> {
    return this.kkshowSearchService.search(keyword.keyword);
  }
}
