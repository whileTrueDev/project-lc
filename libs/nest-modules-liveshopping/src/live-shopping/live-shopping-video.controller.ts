import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LiveShoppingVideo } from '@prisma/client';
import { DefaultPaginationDto, PaginationResult } from '@project-lc/shared-types';
import { LiveShoppingVideoService } from './live-shopping-video.service';

@Controller('live-shopping-video')
export class LiveShoppingVideoController {
  constructor(private readonly liveShoppingVideoService: LiveShoppingVideoService) {}

  /** 크크쇼.com/live-shopping 페이지에서 표시할 지난 라이브영상 목록 조회 */
  @Get()
  public async findAll(
    @Query(new ValidationPipe({ transform: true })) dto: DefaultPaginationDto,
  ): Promise<PaginationResult<LiveShoppingVideo>> {
    return this.liveShoppingVideoService.findAll(dto);
  }
}
