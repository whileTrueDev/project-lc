import { Box, Text } from '@chakra-ui/react';
import { useSellCommission } from '@project-lc/hooks';

export function SettlementSellCommissionInfo(): JSX.Element {
  const commissionInfo = useSellCommission();

  return (
    <Box>
      <Text fontWeight="bold">수수료 정보</Text>
      <Text>{`기본 판매 수수료 : ${commissionInfo.data?.commissionRate}%`}</Text>
      <Text>라이브쇼핑을 통한 판매 수수료 : 각 라이브 쇼핑 수수료 정보에 따름.</Text>
    </Box>
  );
}

export default SettlementSellCommissionInfo;
