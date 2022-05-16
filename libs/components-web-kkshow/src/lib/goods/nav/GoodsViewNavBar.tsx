import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { CartButton } from '../../KkshowNavbar';

export const GoodsViewNavBarHeight = 50;
export function GoodsViewNavBar(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);
  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      bg="blue.500"
      color="whiteAlpha.900"
      p={2}
      minH={GoodsViewNavBarHeight}
      h={{ base: GoodsViewNavBarHeight, md: '60px' }}
      w="100%"
      zIndex="sticky"
      position="sticky"
      top={0}
    >
      <Flex justify="space-between" alignItems="center">
        <Flex gap={2} alignItems="center">
          <IconButton
            rounded="full"
            variant="ghost"
            aria-label="back-button"
            onClick={() => router.back()}
            icon={<ChevronLeftIcon fontSize="xl" />}
          />

          <Text pr={4} noOfLines={1}>
            {goods.data?.goods_name}
          </Text>
        </Flex>

        <CartButton />
      </Flex>
    </Box>
  );
}

export default GoodsViewNavBar;
