import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { throwError } from 'rxjs';
import { hash } from 'argon2';
import { BroadcasterDTO, SignUpDto } from '@project-lc/shared-types';
import { Broadcaster } from '@prisma/client';
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

  async getAllBroadcasterIdAndNickname(): Promise<BroadcasterDTO[]> {
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
        channelUrl: true,
      },
    });
  }

  /** 방송인 회원가입 서비스 핸들러 */
  async signUp(dto: SignUpDto): Promise<Broadcaster> {
    const hashedPw = await hash(dto.password);
    const broadcaster = await this.prisma.broadcaster.create({
      data: {
        email: dto.email,
        userName: dto.name,
        password: hashedPw,
        userId: dto.email,
        userNickname: '',
        overlayUrl: `/${dto.email}`,
      },
    });
    return broadcaster;
  }
}
