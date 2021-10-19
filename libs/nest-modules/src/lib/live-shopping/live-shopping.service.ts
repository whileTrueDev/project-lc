import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class LiveShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  async createLiveShopping(sellerId, dto): Promise<{ liveShoppingId: number }> {
    const streamId = Math.random().toString(36).substr(2, 11);

    const userId = await this.prisma.seller.findFirst({
      where: { email: sellerId },
      select: {
        id: true,
      },
    });
    const liveShopping = await this.prisma.liveShopping.create({
      data: {
        seller: { connect: { id: userId.id } },
        streamId,
        requests: dto.requests,
        goods: { connect: { id: dto.goods_id } },
        sellerContacts: { connect: { id: dto.contactId } },
      },
    });
    return { liveShoppingId: liveShopping.id };
  }
}
