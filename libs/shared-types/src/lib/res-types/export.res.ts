import { Export, ExportItem, Goods, GoodsImages, Order } from '@prisma/client';

export type ExportItemOption = ExportItem & {
  /** 해당 옵션의 상품 고유 번호 */
  goodsId: Goods['id'];
  /** 해당 옵션의 상품 이름 */
  goodsName: Goods['goods_name'];
  /**  해당 옵션의 상품 이미지  */
  image: GoodsImages['image'];
  /** 금액 (numberstring) */
  price: string;
  /** 출고 옵션 명 */
  title1: string;
  /** 출고 옵션 값 */
  option1: string;
};

/** 출고 상세 조회 리턴값 */
export type ExportRes = Export & { items: ExportItemOption[] } & Order; // order의 주문자정보, 받는사람정보, 배송메모 필요

/** 출고 목록 조회 리턴값 */
export type ExportListRes = ExportRes[];

/** 출고 생성 리턴값 */
export type ExportCreateRes = {
  /** 출고 연결된 주문 고유번호(number) */
  orderId: Order['id'];

  /** 출고 연결된 주문코드(string) */
  orderCode: Order['orderCode'];

  /** 출고코드 */
  exportCode: string;
};
