import {
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFmOrdersStats } from '@project-lc/hooks';
import { orderKeys, OrderStatsKeyType } from '@project-lc/shared-types';

export function MypageOrderStats(): JSX.Element {
  const { data } = useFmOrdersStats();

  return (
    <Grid templateColumns={`repeat(${orderKeys.length}, 1fr)`}>
      {orderKeys.map((key) => {
        return (
          <GridItem key={`${key}`} p={5}>
            <Box p={[2, 2, 5, 5]} display="flex" justifyContent="center">
              <Flex direction={['column', 'column', 'column', 'row']}>
                <Stat>
                  <StatLabel fontSize="xl">
                    <Flex alignItems="center">{key}</Flex>
                  </StatLabel>
                  <StatNumber fontSize={['3xl', '4xl', '4xl', '4xl']}>
                    {data?.orders[key as OrderStatsKeyType] || 0}
                    <Text ml={1} as="span" fontSize="xl">
                      건
                    </Text>
                  </StatNumber>
                </Stat>
              </Flex>
            </Box>
          </GridItem>
        );
      })}
    </Grid>
  );
}
