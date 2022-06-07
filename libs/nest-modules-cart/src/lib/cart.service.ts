import { Injectable } from '@nestjs/common';
import { CartItem, CartItemOption, Customer, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CartItemDto, CartItemRes } from '@project-lc/shared-types';
import { flatten } from 'lodash';

type CustomerOrTempUser = {
  customerId?: Customer['id'];
  tempUserId?: CartItem['tempUserId'];
};

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /** 카트 상품 목록 조회 */
  public async find({
    customerId,
    tempUserId,
  }: CustomerOrTempUser): Promise<CartItemRes> {
    return this.prisma.cartItem.findMany({
      where: { OR: [{ customerId }, { tempUserId }] },
      include: {
        options: true,
        support: {
          include: { broadcaster: { select: { userNickname: true, avatar: true } } },
        },
        goods: {
          select: {
            id: true,
            image: true,
            goods_name: true,
            max_purchase_ea: true,
            max_purchase_limit: true,
            min_purchase_ea: true,
            min_purchase_limit: true,
            seller: { select: { sellerShop: { select: { shopName: true } } } },
          },
        },
        // 배송비정책 정보
        shippingGroup: {
          include: {
            shippingSets: {
              include: { shippingOptions: { include: { shippingCost: true } } },
            },
          },
        },
      },
    });
  }

  /** 카트 상품 생성 */
  public async create(dto: CartItemDto): Promise<CartItem> {
    const items = await this.prisma.cartItem.findMany({
      where: { OR: [{ customerId: dto.customerId }, { tempUserId: dto.tempUserId }] },
      include: { goods: { select: { seller: true } } },
    });

    const cartItemData: Prisma.CartItemCreateArgs['data'] = {
      goodsId: dto.goodsId,
      customerId: dto.customerId,
      tempUserId: dto.tempUserId,
      shippingCost: dto.shippingCost,
      shippingCostIncluded: dto.shippingCostIncluded,
      shippingGroupId: dto.shippingGroupId,
      channel: dto.channel,
      options: { createMany: { data: dto.options } },
      support: dto.support
        ? {
            create: {
              broadcasterId: dto.support.broadcasterId,
              nickname: dto.support.nickname,
              message: dto.support.message,
            },
          }
        : undefined,
    };

    if (items.length > 0) {
      // * 동일 '상품'을 등록시 옵션 개수 업데이트 처리
      // 이미 카트에 등록된 상품인지 확인
      const alreadyInserted = items.find((x) => x.goodsId === dto.goodsId);
      // 이미 카트에 등록된 상품에 옵션을 추가할 때
      if (alreadyInserted) {
        // 이미 카트에 등록된 상품옵션 모두 조회
        const alreadyInsertedOpt = await this.prisma.cartItemOption.findMany({
          where: { cartItemId: alreadyInserted.id },
        });
        // 이미 카트에 등록된 상품옵션 ID 배열
        const goodsOptionIds = alreadyInsertedOpt.map((x) => x.goodsOptionsId);

        await Promise.all(
          dto.options.map((o) => {
            // 이미 등록된 장바구니 상품 옵션인 경우 양만 더한다
            if (goodsOptionIds.includes(o.goodsOptionsId)) {
              const optionRow = alreadyInsertedOpt.find(
                (x) => x.goodsOptionsId === o.goodsOptionsId,
              );
              return this.updateQuantity(optionRow.id, optionRow.quantity + o.quantity);
            }
            // 등록되지 않은 장바구니 상품 옵션인 경우 새롭게 생성
            return this.prisma.cartItemOption.create({
              data: { ...o, cartItemId: alreadyInserted.id },
            });
          }),
        );
        return alreadyInserted;
      }

      // * 동일 '판매자'의 상품에 대해 배송비 0원 처리
      const sellerIds = [...new Set(items.map((x) => x.goods.seller.id))];
      // 배송비 0원 처리를 위해 카드 등록 요청한 goods의 정보와 배송정책 정보를 조회
      const goods = await this.prisma.goods.findFirst({
        where: { id: dto.goodsId, sellerId: { in: sellerIds } },
        include: {
          ShippingGroup: {
            include: { shippingSets: { include: { shippingOptions: true } } },
          },
        },
      });

      // 카트에 현재 등록 요청한 상품의 판매자의 상품이 없는 경우
      if (!goods) {
        // 기본 카트 상품 등록 (배송비 포함)
        return this.prisma.cartItem.create({ data: cartItemData });
      }

      // 이미 카트에 들어있는 상품 중, 현재 요청한 카트 상품의 판매자와 동일한 판매자의 상품이 있는 경우
      if (goods) {
        const shippingOpts = goods.ShippingGroup.shippingSets.map(
          (x) => x.shippingOptions,
        );
        const shippingOptsSetTypes = flatten(shippingOpts).map(
          (x) => x.shipping_set_type,
        );
        // 배송정책 타입이 'add' 인 경우에는 배송비 추가 처리
        if (shippingOptsSetTypes.filter((x) => x === 'add').length > 0) {
          return this.prisma.cartItem.create({ data: cartItemData });
        }

        // 그렇지 않은 경우 0원 처리
        // 배송비 0원 처리
        return this.prisma.cartItem.create({
          data: { ...cartItemData, shippingCost: 0, shippingCostIncluded: true },
        });
      }
    }
    // 최초 카트 상품 등록 시
    return this.prisma.cartItem.create({ data: cartItemData });
  }

  /** 카트 상품 옵션 개수 수정 */
  public async updateQuantity(
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
    tempUserId: CartItem['tempUserId'],
    customerId: Customer['id'],
  ): Promise<number> {
    const result = await this.prisma.cartItem.updateMany({
      where: { tempUserId },
      data: { customerId },
    });
    const result2 = await this.prisma.cartItem.updateMany({
      where: { customerId },
      data: { tempUserId },
    });
    return result.count + result2.count;
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
    // 장바구니 상품 삭제 (옵션도 함께)
    if (cartItemId) {
      const result = await this.prisma.cartItem.delete({ where: { id: cartItemId } });
      return !!result;
    }
    // 장바구니 상품 옵션 삭제
    if (cartItemOptionId) {
      const result = await this.prisma.cartItemOption.delete({
        where: { id: cartItemOptionId },
      });
      // 해당 장바구니 상품옵션과 연결된 장바구니 상품의 남은 옵션 개수 조회
      const restOptionsCount = await this.prisma.cartItemOption.count({
        where: { cartItemId: result.cartItemId },
      });
      // 해당 장바구니 상품옵션과 연결된 장바구니 상품에 연결된 옵션이 없는 경우
      if (!(restOptionsCount > 0)) {
        // 해당 장바구니 상품 삭제
        const result2 = await this.prisma.cartItem.delete({
          where: { id: result.cartItemId },
        });
        return !!result2;
      }
      return !!result;
    }
    return false;
  }

  /** 특정 소비자(temp유저)의 장바구니 모두 비우기 */
  public async deleteAll({
    customerId,
    tempUserId,
  }: CustomerOrTempUser): Promise<boolean> {
    const result = await this.prisma.cartItem.deleteMany({
      where: { OR: [{ customerId }, { tempUserId }] },
    });
    return !!result.count;
  }
}
