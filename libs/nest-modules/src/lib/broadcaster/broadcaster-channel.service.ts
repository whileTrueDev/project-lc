import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class BroadcasterChannelService {
  constructor(private readonly prisma: PrismaService) {}

  /** 방송인 채널 생성 */
  async createBroadcasterChannel(): Promise<any> {
    return 'create channel';
  }

  /** 방송인 채널 삭제 */
  async deleteBroadcasterChannel(): Promise<any> {
    return 'delete channel';
  }

  /** 방송인 채널 목록 조회 */
  async getBroadcasterChannelList(): Promise<any> {
    return 'get broadcasters channel list';
  }
}
