import { Box, Text } from '@chakra-ui/react';
import { SettlementList } from './SettlementList';

// 정산 내역 박스
export function SettlementListBox(props) {
  const { sellerSettlements } = props;
  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Text fontSize="lg" fontWeight="medium" pb={1}>
        정산 내역
      </Text>
      <SettlementList sellerSettlements={sellerSettlements} />
    </Box>
  );
}
