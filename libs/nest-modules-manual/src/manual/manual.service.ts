import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Manual, UserType } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { EditManualDto, ManualListRes, PostManualDto } from '@project-lc/shared-types';
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

  /** 이용안내 목록 조회 (컨텐츠 포함 모두 조회)
   */
  async getManualList(target?: UserType): Promise<Manual[]> {
    if (!target) return this.prisma.manual.findMany();
    return this.prisma.manual.findMany({
      where: { target },
      orderBy: [{ mainCategory: 'asc' }, { order: 'asc' }, { title: 'asc' }],
    });
  }

  /** 이용안내 목록 조회(컨텐츠, 생성,수정날짜 제외하고 조회) */
  async getManualListPartial(target: UserType): Promise<ManualListRes> {
    return this.prisma.manual.findMany({
      where: { target },
      orderBy: [{ mainCategory: 'asc' }, { order: 'asc' }, { title: 'asc' }],
      select: {
        id: true,
        target: true,
        mainCategory: true,
        title: true,
        description: true,
        order: true,
      },
    });
  }

  /** 이용안내 id로 조회 */
  async getManualById(id: number): Promise<Manual> {
    const manual = await this.prisma.manual.findUnique({
      where: { id },
    });
    if (!manual) throw new BadRequestException(`존재하지 않는 이용안내입니다. id: ${id}`);
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

  /** routerPath(이용안내 연결할 routerPath)와 target으로 조회 */
  async getManualByRouterPath({
    routerPath,
    userType,
  }: {
    routerPath: string;
    userType: UserType;
  }): Promise<number | null> {
    const manual = await this.prisma.manual.findFirst({
      where: { linkPageRouterPath: routerPath, target: userType },
    });

    if (!manual) return null;
    return manual.id;
  }
}
