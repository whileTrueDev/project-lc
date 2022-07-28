import { Box, Link, Text } from '@chakra-ui/react';
import { useKkshowSubNav } from '@project-lc/hooks';
import NextLink from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function KkshowSubNavbar(): JSX.Element {
  const { data: subNavLinks } = useKkshowSubNav();
  return (
    <Box maxW="5xl" m="auto" minH="60px" px={4} py={4} gap={4}>
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
  );
}
