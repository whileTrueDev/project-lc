import { LinkBox, LinkOverlay, Stack, Text } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { SearchResultItem } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { GoodsDisplayImage } from '../GoodsDisplay';

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
export function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  return (
    <MotionBox whileHover="hover">
      <LinkBox>
        <NextLink href={item.linkUrl} passHref>
          <LinkOverlay isExternal={item.linkUrl.includes('http')}>
            <Stack>
              <GoodsDisplayImage
                rounded="xl"
                src={item.imageUrl}
                // imageProps={{ variants: { hover: { scale: 1.1 } } }} // 이미지 컴포넌트를 motion.img에서 ChakraNextImage로 변경이후, hover시 이미지 사라지는 현상으로 임시 제거
              />
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
