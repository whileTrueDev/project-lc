import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Broadcaster, BroadcasterChannel } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateBroadcasterChannelDto } from '@project-lc/shared-types';

@Injectable()
export class BroadcasterChannelService {
  constructor(private readonly prisma: PrismaService) {}

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
      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 휴면 방송인 채널 복구 */
  async restoreBroadcasterChannel(broadcasterId: Broadcaster['id']): Promise<void> {
    const restoreDatas = await this.prisma.inactiveBroadcasterChannel.findMany({
      where: {
        broadcasterId,
      },
    });
    if (restoreDatas) {
      Promise.all(
        restoreDatas.map((restoreData) =>
          this.prisma.broadcasterChannel.create({
            data: restoreData || undefined,
          }),
        ),
      );
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
