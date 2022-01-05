import { Box, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { MypageOrderStats } from './MypageOrderStats';
import { MypageSalesStats } from './MypageSalesStats';

export function MypageStatsSection(): JSX.Element {
  return (
    <>
      <Box borderWidth="1px" borderRadius="md" p={5} pb={1} m={2}>
        <Flex
          direction={['column', 'column', 'column', 'row']}
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="medium" pb={1}>
            오늘 매출 현황
            <Text
              fontSize="sm"
              as="span"
              colorScheme={useColorModeValue('gray.50', 'whiteAlpha.300')}
              ml={1}
              pb={1}
            >
              ({dayjs().format('MM월 DD일 기준')})
            </Text>
          </Text>
        </Flex>
        <Divider backgroundColor="gray.100" />
        <MypageSalesStats />
      </Box>

      <Box borderWidth="1px" borderRadius="md" p={5} m={2}>
        <Flex
          direction={['column', 'column', 'column', 'row']}
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="medium" pb={1}>
            주문현황
            <Text
              fontSize="sm"
              as="span"
              colorScheme={useColorModeValue('gray.50', 'whiteAlpha.300')}
              ml={1}
              pb={1}
            >
              (최근 1개월 기준)
            </Text>
          </Text>
        </Flex>
        <Divider backgroundColor="gray.100" />
        <MypageOrderStats />
      </Box>
    </>
  );
}
export default MypageStatsSection;
