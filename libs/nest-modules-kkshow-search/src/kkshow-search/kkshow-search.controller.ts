import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { Keyword, SearchResult } from '@project-lc/shared-types';
import { KkshowSearchService } from './kkshow-search.service';

@Controller('search')
export class KkshowSearchController {
  constructor(private readonly kkshowSearchService: KkshowSearchService) {}

  @Get()
  getSearchResults(@Query(ValidationPipe) keyword: Keyword): Promise<SearchResult> {
    return this.kkshowSearchService.searchResultPreprocessing(keyword);
  }
}
