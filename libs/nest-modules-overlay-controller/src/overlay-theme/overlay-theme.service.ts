import { Injectable } from '@nestjs/common';
import { OverlayTheme } from '@prisma/client';

import { PrismaService } from '@project-lc/prisma-orm';
import { CreateOverlayThemeDto } from '@project-lc/shared-types';

@Injectable()
export class OverlayThemeService {
  constructor(private readonly prisma: PrismaService) {}

  // 생성
  async createTheme(dto: CreateOverlayThemeDto): Promise<OverlayTheme> {
    const theme = await this.prisma.overlayTheme.create({
      data: {
        name: dto.name,
        key: dto.key,
        category: dto?.category,
        data: JSON.parse(dto.data),
      },
    });
    return theme;
  }

  // 삭제
  async deleteTheme(id: number): Promise<boolean> {
    await this.prisma.overlayTheme.delete({
      where: { id },
    });
    return true;
  }

  // 목록 조회
  async getList(): Promise<OverlayTheme[]> {
    const list = await this.prisma.overlayTheme.findMany({
      orderBy: [{ category: 'asc' }, { createDate: 'desc' }],
    });
    return list;
  }

  // 특정 테마 데이터 조회
  async getTheme(id: number): Promise<OverlayTheme> {
    const theme = await this.prisma.overlayTheme.findUnique({ where: { id } });
    return theme;
  }
}
