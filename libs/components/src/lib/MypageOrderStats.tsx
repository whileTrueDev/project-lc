import { Flex, Text, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { useFmOrdersStats } from '@project-lc/hooks';
import { useEffect } from 'react';

export function MypageOrderStats(): JSX.Element {
  const orders = useFmOrdersStats();

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <Flex direction={['column', 'column', 'column', 'row']}>
      <Stat>
        <StatLabel fontSize="lg">정산 예정 금액</StatLabel>
        <StatNumber fontSize={['4xl', '5xl', '5xl', '5xl']}>
          20,000
          <Text ml={1} as="span" fontSize="2xl">
            원
          </Text>
        </StatNumber>
        <StatHelpText>2021.08.02 - 2021.08.15</StatHelpText>
      </Stat>
    </Flex>
  );
}
