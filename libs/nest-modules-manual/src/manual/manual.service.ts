import { Injectable, CACHE_MANAGER, Inject, BadRequestException } from '@nestjs/common';
import { Manual, UserType } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { EditManualDto, PostManualDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class ManualService extends ServiceBaseWithCache {
  #MANUAL_CACHE_KEY = 'manual';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 이용안내 생성 */
  async createManual(dto: PostManualDto): Promise<Manual> {
    const manual = await this.prisma.manual.create({
      data: dto,
    });
    await this._clearCaches(this.#MANUAL_CACHE_KEY);
    return manual;
  }

  /** 이용안내 목록 조회
   * @param target? seller | broadcaster 유저타입 명시하면 해당 타입에 해당하는 이용안내 데이터만 조회(order 오름차순, 이름 오름차순 정렬)
   */
  async getManualList(target?: UserType): Promise<Manual[]> {
    if (!target) return this.prisma.manual.findMany();

    return this.prisma.manual.findMany({
      where: {
        target,
      },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    });
  }

  /** 이용안내 개별 조회(id로 조회) */
  async getOneManualById(id: number): Promise<Manual> {
    const manual = await this.prisma.manual.findUnique({ where: { id } });
    if (!manual) {
      throw new BadRequestException(`해당 이용안내 데이터가 없습니다 id: ${id}`);
    }
    return manual;
  }

  /** 이용안내 수정 */
  async updateOneManual(id: number, dto: EditManualDto): Promise<boolean> {
    await this.prisma.manual.update({
      where: { id },
      data: dto,
    });
    return true;
  }

  /** 이용안내 삭제 */
  async deleteOneManual(id: number): Promise<boolean> {
    await this.prisma.manual.delete({
      where: { id },
    });
    return true;
  }
}
