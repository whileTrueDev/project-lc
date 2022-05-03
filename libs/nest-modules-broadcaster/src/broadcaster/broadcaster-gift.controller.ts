import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { BroadcasterOnlyNickNameAndAvatar } from '@project-lc/shared-types';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster/gift')
export class BroadcasterGiftController {
  constructor(private readonly broadcasterService: BroadcasterService) {}

  @Get('display')
  public async findBroadcaster(
    @Query(ValidationPipe) dto: { id: number },
  ): Promise<BroadcasterOnlyNickNameAndAvatar> {
    return this.broadcasterService.getBroadcasterGiftPage(dto.id);
  }
}
