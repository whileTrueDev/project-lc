import { Injectable } from '@nestjs/common';
import { LiveShoppingEmbed } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateKkshowLiveEmbedDto } from '@project-lc/shared-types';

@Injectable()
export class KkshowLiveEmbedService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 임베드 레코드 목록 조회
   */
  public async findAll(): Promise<LiveShoppingEmbed[]> {
    return this.prisma.liveShoppingEmbed.findMany({
      orderBy: { id: 'desc' },
    });
  }

  /**
   * 임베드 레코드 생성
   */
  public async create(dto: CreateKkshowLiveEmbedDto): Promise<LiveShoppingEmbed> {
    return this.prisma.liveShoppingEmbed.create({
      data: {
        streamingService: dto.streamingService,
        UID: dto.UID,
        liveShopping: { connect: { id: dto.liveShoppingId } },
      },
    });
  }

  /**
   * 임베드 레코드 삭제
   */
  public async delete(id: LiveShoppingEmbed['id']): Promise<boolean> {
    const result = await this.prisma.liveShoppingEmbed.delete({
      where: { id },
    });
    return !!result;
  }
}
