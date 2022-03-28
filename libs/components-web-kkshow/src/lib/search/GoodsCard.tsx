import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { AspectRatio, Box, LinkBox, LinkOverlay, Stack, Text } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { SearchResultItem } from '@project-lc/shared-types';
import { motion } from 'framer-motion';
import NextLink from 'next/link';

const variants = {
  hover: { scale: 1.1 },
  normal: { scale: 1.0, minHeight: '132px', minWidth: '132px' },
};

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
export function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  return (
    <MotionBox initial="normal" whileHover="hover">
      <LinkBox>
        <NextLink href={item.linkUrl} passHref>
          <LinkOverlay isExternal={item.linkUrl.includes('http')}>
            <Stack>
              <Box rounded="xl" overflow="hidden" position="relative">
                <AspectRatio ratio={1}>
                  <motion.img
                    src={item.imageUrl}
                    variants={variants}
                    style={{ objectFit: 'cover' }}
                  />
                </AspectRatio>

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
    </MotionBox>
  );
}
