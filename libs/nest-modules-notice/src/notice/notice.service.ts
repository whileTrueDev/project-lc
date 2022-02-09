import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Notice } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { NoticePatchDto, NoticePostDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';

@Injectable()
export class NoticeService extends ServiceBaseWithCache {
  #NOTICE_CACHE_KEY = 'notice';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  public async getNotices(): Promise<Notice[]> {
    const notice = await this.prisma.notice.findMany({
      where: { postingFlag: true },
      orderBy: [{ postingDate: 'desc' }],
    });

    return notice;
  }

  // 관리자용 공지사항 조건 미할당 조회
  public async getAdminNotices(): Promise<Notice[]> {
    const notice = await this.prisma.notice.findMany({
      orderBy: [{ postingDate: 'desc' }],
    });
    return notice;
  }

  // 공지사항 생성
  public async postNotice(dto: NoticePostDto): Promise<Notice> {
    const notice = await this.prisma.notice.create({
      data: {
        title: dto.title,
        url: dto.url,
        postingDate: dayjs().toISOString(),
      },
    });
    await this._clearCaches(this.#NOTICE_CACHE_KEY);

    return notice;
  }

  // 공지사항 posting Flag 변경
  public async patchNotice(dto: NoticePatchDto): Promise<Notice> {
    const notice = await this.prisma.notice.update({
      data: {
        postingFlag: dto.postingFlag,
        postingDate: dto.postingFlag ? dayjs().toISOString() : undefined,
      },
      where: { id: dto.id },
    });

    await this._clearCaches(this.#NOTICE_CACHE_KEY);
    return notice;
  }

  // 공지사항 삭제
  public async deleteNotice(id: Notice['id']): Promise<Notice> {
    const notice = await this.prisma.notice.delete({ where: { id } });
    await this._clearCaches(this.#NOTICE_CACHE_KEY);
    return notice;
  }
}
