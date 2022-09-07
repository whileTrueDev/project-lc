import { Injectable } from '@nestjs/common';
import { Notice, NoticeTarget } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { NoticePatchDto, NoticePostDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  public async getNotices(target?: NoticeTarget): Promise<Notice[]> {
    const notice = await this.prisma.notice.findMany({
      where: { postingFlag: true, target: target ? { in: ['all', target] } : undefined },
      orderBy: [{ postingDate: 'desc' }],
    });
    return notice;
  }

  // 관리자용 공지사항 조건 미할당 조회
  public async getAdminNotices(): Promise<Notice[]> {
    const notice = await this.prisma.notice.findMany({
      orderBy: [{ id: 'desc' }],
    });
    return notice;
  }

  // 공지사항 생성
  public async postNotice(dto: NoticePostDto): Promise<Notice> {
    const notice = await this.prisma.notice.create({
      data: {
        title: dto.title,
        url: dto.url,
        target: dto.target,
        postingDate: dayjs().toISOString(),
      },
    });

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

    return notice;
  }

  // 공지사항 삭제
  public async deleteNotice(id: Notice['id']): Promise<Notice> {
    const notice = await this.prisma.notice.delete({ where: { id } });
    return notice;
  }
}
