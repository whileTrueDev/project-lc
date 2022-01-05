import { Spinner } from '@chakra-ui/react';
import { useAdminBroadcasterSettlementHistories } from '@project-lc/hooks';
import { BcSettlementHistory } from '@project-lc/components-web-bc/BcSettlementHistory';

/** 판매자 정산 완료 목록 */
export function AdminBcSettlementDoneList(): JSX.Element | null {
  const { isLoading, data } = useAdminBroadcasterSettlementHistories();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return <BcSettlementHistory data={data} pageSize={30} />;
}
