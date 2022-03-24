import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { Box, LinkBox, LinkOverlay, Stack, Text, useBoolean } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { motion } from 'framer-motion';
import NextLink from 'next/link';

const variants = {
  scale: { scale: 1.1 },
  normal: { scale: 1.0, minHeight: '132px', minWidth: '132px' },
};

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
export function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  const [mouseOver, setMouseOver] = useBoolean(false);
  return (
    <LinkBox onMouseOver={setMouseOver.on} onMouseOut={setMouseOver.off}>
      <NextLink href={item.linkUrl} passHref>
        <LinkOverlay isExternal={item.linkUrl.includes('http')}>
          <Stack minW="132px">
            <Box rounded="xl" overflow="hidden" position="relative">
              <motion.img
                src={item.imageUrl}
                initial="normal"
                animate={mouseOver ? 'scale' : 'normal'}
                variants={variants}
                style={{ objectFit: 'cover' }}
              />
              <Icon
                as={ArrowForwardIcon}
                position="absolute"
                right={2}
                bottom={2}
                color="white"
                rounded="full"
                bg="rgba(0,0,0,0.4)"
                p={1}
                boxSize="2em"
              />
            </Box>
            <Text fontFamily="Gmarket Sans" textAlign="center">
              {item.title}
            </Text>
          </Stack>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}
