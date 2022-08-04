import { Box, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { useKkshowSubNav } from '@project-lc/hooks';
import { KkshowNavbarVariant } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

export const KkshowSubNavbarHeight = 56;
export default function KkshowSubNavbar({
  variant = 'blue',
}: {
  /** KkshowNavbar와 동일한 variant 전달받아 사용 */
  variant?: KkshowNavbarVariant;
}): JSX.Element {
  const { data: subNavLinks } = useKkshowSubNav();

  // 기본 배경색, 글자색
  const palette = {
    bg: useColorModeValue('white', 'gray.800'),
    color: useColorModeValue('gray.700', 'whiteAlpha.900'),
  };

  // variant === 'blue'인 경우 배경색, 글자색
  if (variant === 'blue') {
    palette.bg = 'blue.500';
    palette.color = 'whiteAlpha.900';
  }
  return (
    <Box
      h={`${KkshowSubNavbarHeight}px`}
      position="sticky"
      top={0}
      bg={palette.bg}
      color={palette.color}
      w="100%"
      zIndex="sticky"
    >
      <Box maxW="5xl" m="auto" px={4} py={4} gap={4}>
        <Swiper slidesPerView="auto" style={{ margin: 0 }}>
          {subNavLinks?.map((subNavLink) => (
            <SwiperSlide
              key={subNavLink.id}
              style={{
                width: 'auto',
                paddingRight: 16,
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <NextLink href={subNavLink.link} passHref>
                <Link pr={2} href={subNavLink.link}>
                  <Text>{subNavLink.name}</Text>
                </Link>
              </NextLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
