import { Injectable } from '@nestjs/common';
import { CartItem, CartItemOption, Customer } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CartItemDto, CartItemRes } from '@project-lc/shared-types';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /** 카트 상품 목록 조회 */
  public async find({
    customerId,
    tempUserId,
  }: {
    customerId?: Customer['id'];
    tempUserId?: CartItem['tempUserId'];
  }): Promise<CartItemRes> {
    return this.prisma.cartItem.findMany({
      where: { OR: [{ customerId }, { tempUserId }] },
      include: {
        options: true,
        support: true,
        goods: {
          select: {
            image: true,
            goods_name: true,
            seller: { select: { sellerShop: { select: { shopName: true } } } },
          },
        },
      },
    });
  }

  /** 카트 상품 생성 */
  public async create(dto: CartItemDto): Promise<CartItem> {
    // 이미 카트에 등록된 상품인지 확인
    const alreadyInserted = await this.prisma.cartItem.findFirst({
      where: {
        OR: [{ customerId: dto.customerId }, { tempUserId: dto.tempUserId }],
        AND: { goodsId: dto.goodsId },
      },
    });
    // 이미 카트에 등록된 상품에 옵션을 추가할 때
    if (alreadyInserted) {
      await this.prisma.cartItemOption.createMany({
        data: dto.options.map((o) => ({
          ...o,
          cartItemId: alreadyInserted.id,
        })),
      });
      return alreadyInserted;
    }
    return this.prisma.cartItem.create({
      data: {
        goodsId: dto.goodsId,
        customerId: dto.customerId,
        tempUserId: dto.tempUserId,
        shippingCost: dto.shippingCost,
        shippingCostIncluded: dto.shippingCostIncluded,
        shippingGroupId: dto.shippingGroupId,
        options: { createMany: { data: dto.options } },
        support: {
          create: {
            broadcasterId: dto.support.broadcasterId,
            nickname: dto.support.nickname,
            message: dto.support.message,
          },
        },
      },
    });
  }

  /** 카트 상품 옵션 개수 수정 */
  public async update(
    cartItemOptionId: CartItemOption['id'],
    targetQuantity: CartItemOption['quantity'],
  ): Promise<CartItemOption> {
    return this.prisma.cartItemOption.update({
      where: { id: cartItemOptionId },
      data: { quantity: targetQuantity },
    });
  }

  /** temp 카트 상품을 특정 소비자의 카트 상품으로 변경 */
  public async tempToCustomer(
    cartItemIds: CartItem['id'][],
    customerId: Customer['id'],
  ): Promise<number> {
    const result = await this.prisma.cartItem.updateMany({
      where: { id: { in: cartItemIds } },
      data: { customerId },
    });
    return result.count;
  }

  /** 특정 카트 상품 또는 상품옵션 삭제 */
  public async delete({
    cartItemId,
    cartItemOptionId,
  }: {
    cartItemId?: CartItem['id'];
    cartItemOptionId?: CartItemOption['id'];
  }): Promise<boolean> {
    if (!(cartItemId || cartItemOptionId)) return false;
    // 상품 삭제
    if (cartItemId) {
      const result = await this.prisma.cartItem.delete({ where: { id: cartItemId } });
      return !!result;
    }
    // 상품 옵션 삭제
    if (cartItemOptionId) {
      const result = await this.prisma.cartItemOption.delete({
        where: { id: cartItemOptionId },
      });
      // 해당 카트상품옵션과 연결된 카트상품의 남은 옵션 개수 조회
      const restOptionsCount = await this.prisma.cartItemOption.count({
        where: { cartItemId: result.cartItemId },
      });
      // 해당 카트상품옵션과 연결된 카트상품에 연결된 옵션이 없는 경우
      if (!(restOptionsCount > 0)) {
        // 해당 카트상품 삭제
        const result2 = await this.prisma.cartItem.delete({
          where: { id: result.cartItemId },
        });
        return !!result2;
      }
      return !!result;
    }
    return false;
  }
}
