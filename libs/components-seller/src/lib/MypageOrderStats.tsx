import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useFmOrdersStats } from '@project-lc/hooks';
import { orderKeys, OrderStatsKeyType } from '@project-lc/shared-types';

export function MypageOrderStats(): JSX.Element {
  const { data } = useFmOrdersStats();

  return (
    <Grid templateColumns={`repeat(${orderKeys.length}, 1fr)`}>
      {orderKeys.map((key) => {
        return (
          <GridItem key={`${key}`} p={5} colSpan={[orderKeys.length, 1, 1, 1]}>
            <Box p={[2, 2, 5, 5]} display="flex" justifyContent="center">
              <Flex direction="row">
                <Stat>
                  <StatLabel fontSize={['lg', 'xl']}>
                    <Flex alignItems="center">{key}</Flex>
                  </StatLabel>
                  <StatNumber
                    fontSize={['3xl', '4xl', '4xl', '4xl']}
                    display="flex"
                    justifyContent="center"
                    alignItems="baseline"
                  >
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

export default MypageOrderStats;
