import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { Notice } from '@prisma/client';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  public async getNotices(): Promise<Notice[]> {
    const notice = await this.prisma.notice.findMany({
      where: {
        postingFlag: true,
      },
    });

    return notice;
  }
}
