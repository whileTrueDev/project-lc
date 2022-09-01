import { Injectable } from '@nestjs/common';
import { KkshowBcList } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateKkshowBcListDto } from '@project-lc/shared-types';

@Injectable()
export class KkshowBcListService {
  constructor(private readonly prisma: PrismaService) {}

  /** 크크쇼 방송인 목록 모두 조회 */
  public async findAll(): Promise<KkshowBcList[]> {
    return this.prisma.kkshowBcList.findMany();
  }

  /** 크크쇼 방송인 목록 - 방송인 등록 */
  public async create(dto: CreateKkshowBcListDto): Promise<KkshowBcList> {
    return this.prisma.kkshowBcList.create({ data: dto });
  }

  /** 크크쇼 방송인 목록 - 특정 방송인 삭제 */
  public async delete(id: KkshowBcList['id']): Promise<KkshowBcList> {
    return this.prisma.kkshowBcList.delete({ where: { id } });
  }
}
