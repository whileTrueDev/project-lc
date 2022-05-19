import { Goods, GoodsImages, OrderItem, OrderItemOption } from '@prisma/client';

export interface OrderItemReviewNeeded extends OrderItem {
  goodsId: Goods['id'];
  options: OrderItemOption[];
  goods: {
    goods_name: Goods['goods_name'];
    image: GoodsImages[];
  };
}

export type OrderItemReviewNeededRes = OrderItemReviewNeeded[];
