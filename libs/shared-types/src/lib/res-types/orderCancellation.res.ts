import { OrderCancellation } from '@prisma/client';

/** 주문취소요청 리턴데이터 타입 (프론트 작업시 필요한 형태로 수정하여 사용) */
export type CreateOrderCancellationRes = OrderCancellation;
