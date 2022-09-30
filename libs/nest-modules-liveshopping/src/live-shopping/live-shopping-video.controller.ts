import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LiveShoppingVideo } from '@prisma/client';
import { DefaultPaginationDto, PaginationResult } from '@project-lc/shared-types';
import { LiveShoppingVideoService } from './live-shopping-video.service';

@Controller('live-shopping-video')
export class LiveShoppingVideoController {
  constructor(private readonly liveShoppingVideoService: LiveShoppingVideoService) {}

  @Get()
  public async findAll(
    @Query(new ValidationPipe({ transform: true })) dto: DefaultPaginationDto,
  ): Promise<PaginationResult<LiveShoppingVideo>> {
    return this.liveShoppingVideoService.findAll(dto);
  }
}
