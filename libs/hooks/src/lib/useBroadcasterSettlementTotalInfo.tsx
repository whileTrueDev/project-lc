import { BroadcasterSettlementTargetsItem } from '@project-lc/shared-types';
import { BcSettlementTotalInfo, calcBcSettlementTotalInfo } from '@project-lc/utils';
import { useMemo } from 'react';

/** 방송인 정산 대상 총 정보 */
export const useBroadcasterSettlementTotalInfo = (
  settlementTarget: BroadcasterSettlementTargetsItem,
): BcSettlementTotalInfo => {
  return useMemo(() => calcBcSettlementTotalInfo(settlementTarget), [settlementTarget]);
};
