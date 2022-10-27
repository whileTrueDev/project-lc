import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  DefaultPaginationDto,
  PaginatedLiveShoppingVideoRes,
} from '@project-lc/shared-types';

@Injectable()
export class LiveShoppingVideoService {
  constructor(private readonly prisma: PrismaService) {}

  /** 전체 라이브쇼핑 비디오 조회 */
  public async findAll(
    dto: DefaultPaginationDto,
  ): Promise<PaginatedLiveShoppingVideoRes> {
    const { skip, take } = dto;
    const realTake = take + 1;
    const result = await this.prisma.liveShoppingVideo.findMany({
      skip,
      take: realTake,
      include: {
        LiveShopping: {
          select: {
            liveShoppingName: true,
            broadcaster: {
              select: {
                userNickname: true,
              },
            },
            broadcastStartDate: true,
            broadcastEndDate: true,
            sellStartDate: true,
            sellEndDate: true,
            seller: {
              select: {
                sellerShop: {
                  select: {
                    shopName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const hasNextPage = result.length === realTake;
    return {
      edges: result.slice(0, take),
      hasNextPage,
      nextCursor: hasNextPage ? skip + take : undefined,
    };
  }
}
