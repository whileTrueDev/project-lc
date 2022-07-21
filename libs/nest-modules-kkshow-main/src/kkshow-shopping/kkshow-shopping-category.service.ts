import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class KkshowShoppingCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<string[]> {
    const result = await this.prisma.kkshowShoppingTabCategory.findMany();
    return result.map((x) => x.goodsCategoryCode);
  }

  public async add(): Promise<any> {
    // TODO: 카테고리 목록 추가 구성
  }

  public async remove(): Promise<any> {
    // TODO: 카테고리 목록 제거 구성
  }
}
