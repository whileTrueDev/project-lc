import { Injectable } from '@nestjs/common';
import { KkshowShoppingTabCategory } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class KkshowShoppingCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<string[]> {
    const result = await this.prisma.kkshowShoppingTabCategory.findMany();
    return result.map((x) => x.goodsCategoryCode);
  }

  public async add(categoryCode: string): Promise<KkshowShoppingTabCategory> {
    return this.prisma.kkshowShoppingTabCategory.create({
      data: { goodsCategoryCode: categoryCode },
    });
  }

  public async remove(categoryCode: string): Promise<boolean> {
    const result = await this.prisma.kkshowShoppingTabCategory.delete({
      where: { goodsCategoryCode: categoryCode },
    });
    return !!result.goodsCategoryCode;
  }
}
