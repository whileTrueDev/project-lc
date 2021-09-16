import {
  FmOrderRefund,
  fmOrderRefundStatses,
  FmOrderReturn,
  fmOrderReturnStatuses,
} from '@project-lc/shared-types';
import { useMemo } from 'react';

/**
 * 주문의 여러 환불,반품 중 현재 환불,반품 상태를 찾습니다.
 * @param returnOrRefundArray FmOrderReturn[] | FmOrderRefund[]
 * @returns 'request' | 'ing' | 'complete' | null
 */
export const useOrderReturnOrRefundStatus = (
  returnOrRefundArray?: FmOrderReturn[] | FmOrderRefund[],
) => {
  // 이 주문의 여러 환불 상태 중, 최종 환불 상태 찾기
  const realStatus:
    | keyof typeof fmOrderRefundStatses
    | null
    | keyof typeof fmOrderReturnStatuses = useMemo(() => {
    if (returnOrRefundArray && returnOrRefundArray.length > 0) {
      const refundStatuses = returnOrRefundArray.map((x) => x.status);
      if (refundStatuses.includes('request')) return 'request';
      if (refundStatuses.includes('ing')) return 'ing';
      if (refundStatuses.includes('complete')) return 'complete';
      return null;
    }
    return null;
  }, [returnOrRefundArray]);

  return realStatus;
};
