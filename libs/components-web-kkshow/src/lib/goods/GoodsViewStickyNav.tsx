import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useGoodsViewStore } from '@project-lc/stores';

const navs = [
  { title: '상세 설명', elementId: 'goods-contents' },
  { title: `후기`, elementId: 'goods-reviews' },
  { title: '상품 문의', elementId: 'goods-inquiries' },
  { title: '기타 정보', elementId: 'goods-info' },
];

export function GoodsViewStickyNav(): JSX.Element {
  const store = useGoodsViewStore();
  const onClick = (elId: string): void => {
    const el = document.getElementById(elId);
    if (el) el.scrollIntoView();
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Flex
      position="sticky"
      top={0}
      bgColor={bgColor}
      h={{ base: '50px', md: '60px' }}
      zIndex="sticky"
    >
      <HStack maxW="5xl" mx="auto" w="100%" justify="space-between" spacing={0}>
        {navs.map((nav, idx) => (
          <Box
            key={nav.title}
            textAlign="center"
            py={3}
            h="100%"
            w="100%"
            borderWidth="thin"
            borderRightWidth={0}
            _last={{ borderRightWidth: 'thin' }}
            borderBottom={idx === store.selectedNavIdx ? '3px solid' : undefined}
            borderBottomColor={idx === store.selectedNavIdx ? 'blue.400' : undefined}
            onClick={() => {
              store.handleSelect(idx);
              onClick(nav.elementId);
            }}
            cursor="pointer"
          >
            <Text fontSize={{ base: 'sm', md: 'xl' }}>
              {nav.title}
              {nav.title === '후기' && (
                <Text as="span">{`(${(3403).toLocaleString()})`}</Text>
              )}
            </Text>
          </Box>
        ))}
      </HStack>
    </Flex>
  );
}
