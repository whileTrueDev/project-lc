import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { throwError } from 'rxjs';

@Injectable()
export class BroadcasterService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserId(overlayUrl: string): Promise<{ userId: string }> {
    const userId = await this.prisma.broadcaster.findUnique({
      select: {
        userId: true,
      },
      where: {
        overlayUrl,
      },
    });
    if (!userId) {
      throwError('Fail to get userId by overlayUrl');
    }
    return userId;
  }

  async getAllBroadcasterIdAndNickname(): Promise<any> {
    return this.prisma.broadcaster.findMany({
      where: {
        deleteFlag: false,
      },
      select: {
        userId: true,
        userNickname: true,
        afreecaId: true,
        twitchId: true,
        youtubeId: true,
      },
    });
  }
}
