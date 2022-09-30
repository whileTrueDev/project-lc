import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useGoodsReviewCount } from '@project-lc/hooks';
import { useGoodsViewStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { KkshowSubNavbarHeight } from '../../KkshowSubNavbar';
import { GoodsViewNavBarHeight } from './GoodsViewNavBar';

const navs = [
  { title: '상세 설명', elementId: 'goods-contents' },
  { title: `후기`, elementId: 'goods-reviews' },
  { title: '상품 문의', elementId: 'goods-inquiries' },
  { title: '기타 정보', elementId: 'goods-info' },
];

interface GoodsViewStickyNavProps {
  topMargin?: number;
}
export function GoodsViewStickyNav({
  topMargin = KkshowSubNavbarHeight,
}: GoodsViewStickyNavProps): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const reviewsCount = useGoodsReviewCount(goodsId);

  const bgColor = useColorModeValue('white', 'gray.800');

  const selectedNavIdx = useGoodsViewStore((s) => s.selectedNavIdx);
  const handleSelectNav = useGoodsViewStore((s) => s.handleSelectNav);

  // nav 클릭시 스크롤 이동
  const onClick = (elId: string): void => {
    const el = document.getElementById(elId);
    if (el) el.scrollIntoView();
  };

  return (
    <Flex
      position="sticky"
      bgColor={bgColor}
      h={{ base: '50px', md: '60px' }}
      top={{
        base: topMargin === 0 ? 0 : GoodsViewNavBarHeight,
        md: `${topMargin}px`,
      }}
      zIndex="sticky"
    >
      <HStack maxW="5xl" mx="auto" w="100%" justify="space-between" spacing={0}>
        {navs.map((nav, idx) => (
          <Box
            as="button"
            key={nav.title}
            textAlign="center"
            py={3}
            h="100%"
            w="100%"
            borderWidth="thin"
            borderRightWidth={0}
            _last={{ borderRightWidth: 'thin' }}
            borderBottom={idx === selectedNavIdx ? '3px solid' : undefined}
            borderBottomColor={idx === selectedNavIdx ? 'blue.400' : undefined}
            onClick={() => {
              handleSelectNav(idx);
              onClick(nav.elementId);
            }}
            cursor="pointer"
          >
            <Text fontSize={{ base: 'sm', md: 'xl' }}>
              {nav.title}
              {nav.title === '후기' && reviewsCount?.data ? (
                <Text as="span">{`(${getLocaleNumber(reviewsCount.data)})`}</Text>
              ) : null}
            </Text>
          </Box>
        ))}
      </HStack>
    </Flex>
  );
}
