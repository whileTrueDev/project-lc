import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BroadcasterChannel } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateBroadcasterChannelDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class BroadcasterChannelService extends ServiceBaseWithCache {
  #BC_CHANNEL_CACHE_KEY = 'channel-list';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 방송인 채널 생성,
   * @param dto = {
   *  id : Broadcaster.id (number),
   *  url: url (string)
   * }
   * @return 생성된 채널 데이터 반환 */
  async createBroadcasterChannel(
    dto: CreateBroadcasterChannelDto,
  ): Promise<BroadcasterChannel> {
    const { broadcasterId, url } = dto;
    try {
      const channel = await this.prisma.broadcasterChannel.create({
        data: {
          url,
          broadcaster: { connect: { id: broadcasterId } },
        },
      });
      await this._clearCaches(this.#BC_CHANNEL_CACHE_KEY);
      return channel;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `error in createBroadcasterChannel, dto : ${JSON.stringify(dto)}`,
      );
    }
  }

  /** 방송인 채널 삭제
   * @param channelId : broadcaster.id
   * @return boolean
   */
  async deleteBroadcasterChannel(channelId: number): Promise<boolean> {
    try {
      await this.prisma.broadcasterChannel.delete({
        where: {
          id: channelId,
        },
      });
      await this._clearCaches(this.#BC_CHANNEL_CACHE_KEY);
      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 방송인 채널 목록 조회 - 특정 방송인의 채널 목록 조회
   * @param broadcasterId : broadcaster.id
   * @return BroadcasterChannel[]
   */
  async getBroadcasterChannelList(broadcasterId: number): Promise<BroadcasterChannel[]> {
    try {
      const broadcaster = await this.prisma.broadcaster.findFirst({
        where: { id: broadcasterId },
        select: { channels: true },
      });

      if (!broadcaster) {
        throw new BadRequestException(
          `해당 id를 가진 방송인이 존재하지 않습니다. id: ${broadcasterId}`,
        );
      }

      return broadcaster.channels;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
