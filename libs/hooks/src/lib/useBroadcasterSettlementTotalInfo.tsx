import { BroadcasterSettlementTarget } from '@project-lc/shared-types';
import {
  BroadcasterSettlementTotalInfo,
  calcBroadcasterSettlementTotalInfo,
} from '@project-lc/utils';
import { useMemo } from 'react';

/** 방송인 정산 정보 */
export const useBroadcasterSettlementTotalInfo = (
  settlementTarget: BroadcasterSettlementTarget,
): BroadcasterSettlementTotalInfo => {
  return useMemo(
    () => calcBroadcasterSettlementTotalInfo(settlementTarget.items),
    [settlementTarget.items],
  );
};
