import { Injectable } from '@nestjs/common';
import { CartItem, CartItemOption, CartItemSupport, Customer } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CartItemDto } from '@project-lc/shared-types';

export type CartItemRes = Array<
  CartItem & { options: CartItemOption[]; support: CartItemSupport }
>;

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
      include: { options: true, support: true },
    });
  }

  /** 카트 상품 생성 */
  public async create(dto: CartItemDto): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: {
        goodsId: dto.goodsId,
        customerId: dto.customerId,
        tempUserId: dto.tempUserId,
        shippingCost: dto.shippingCost,
        shippingCostIncluded: dto.shippingCostIncluded,
        shippingGroupId: dto.shippingGroupId,
        options: {
          createMany: {
            data: dto.options.map((o) => ({
              discountPrice: o.discountPrice,
              normalPrice: o.normalPrice,
              quantity: o.quantity,
              name: o.name,
              value: o.value,
              weight: o.weight,
              goodsOptionsId: o.goodsOptionsId,
            })),
          },
        },
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

  /** 특정 카트 상품 삭제 */
  public async delete(cartItemId: CartItem['id']): Promise<boolean> {
    const result = await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return !!result;
  }
}
