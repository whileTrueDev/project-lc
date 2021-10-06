import { Box, Text } from '@chakra-ui/react';

import { SettlementList, SettlementListProps } from './SettlementList';
// 정산 내역 박스

export function SettlementListBox(props: SettlementListProps): JSX.Element {
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
