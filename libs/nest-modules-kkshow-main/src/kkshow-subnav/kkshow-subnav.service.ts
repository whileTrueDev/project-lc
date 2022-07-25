import { Injectable } from '@nestjs/common';
import { KkshowSubNavLink } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateKkshowSubNavDto } from '@project-lc/shared-types';

@Injectable()
export class KkshowSubNavService {
  constructor(private readonly prisma: PrismaService) {}

  /** 서브 nav 링크 목록 조회 */
  public async findAll(): Promise<KkshowSubNavLink[]> {
    return this.prisma.kkshowSubNavLink.findMany({
      orderBy: [{ index: 'asc' }, { name: 'asc' }],
    });
  }

  public async add(dto: CreateKkshowSubNavDto): Promise<KkshowSubNavLink> {
    return this.prisma.kkshowSubNavLink.create({ data: dto });
  }

  public async remove(id: KkshowSubNavLink['id']): Promise<boolean> {
    const result = await this.prisma.kkshowSubNavLink.delete({ where: { id } });
    return !!result;
  }
}
