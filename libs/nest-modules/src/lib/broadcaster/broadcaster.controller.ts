import { Controller, Delete, Get, Post } from '@nestjs/common';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterService } from './broadcaster.service';

@Controller('broadcaster')
export class BroadcasterController {
  constructor(
    private readonly broadcasterService: BroadcasterService,
    private readonly channelService: BroadcasterChannelService,
  ) {}

  /** 방송인 채널 생성 */
  @Post('/channel')
  createBroadcasterChannel(): any {
    return this.channelService.createBroadcasterChannel();
  }

  /** 방송인 채널 삭제 */
  @Delete('/channel/:channelId')
  deleteBroadcasterChannel(): any {
    return this.channelService.deleteBroadcasterChannel();
  }

  /** 방송인 채널 목록 조회 */
  @Get('/:broadcasterId/channel-list')
  getBroadcasterChannelList(): any {
    return this.channelService.getBroadcasterChannelList();
  }
}
