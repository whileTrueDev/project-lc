import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

import { throwError } from 'rxjs';

@Injectable()
export class OverlayControllerService {
  constructor(private readonly prisma: PrismaService) {}

  async getCreatorUrls(): Promise<{ userNickname: string; overlayUrl: string }[]> {
    const urlAndNickname = await this.prisma.user.findMany({
      select: {
        userNickname: true,
        overlayUrl: true,
      },
    });
    if (!urlAndNickname) throwError('Cannot Get Data From Db');
    return urlAndNickname;
  }
}
