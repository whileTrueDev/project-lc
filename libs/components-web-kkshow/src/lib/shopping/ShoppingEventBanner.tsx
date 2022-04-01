import { Box, Flex, Heading, Image, LinkBox, LinkOverlay } from '@chakra-ui/react';
import SlideCustom from '@project-lc/components-layout/motion/SlideCustom';
import { useKkshowShopping } from '@project-lc/hooks';
import Link from 'next/link';

export function ShoppingEventBanner(): JSX.Element | null {
  const { data } = useKkshowShopping();
  if (!data) return null;
  return (
    <LinkBox>
      <Box mx="auto" maxW="5xl" pt={5} pb={20}>
        <SlideCustom>
          <Flex
            color="whiteAlpha.900"
            bgColor="blue.500"
            mx={2}
            h={120}
            rounded="2xl"
            justify="center"
            alignItems="center"
            textAlign="center"
            position="relative"
          >
            <Link passHref href={data.banner.linkUrl}>
              <LinkOverlay isExternal>
                <Heading
                  zIndex={2}
                  fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                  whiteSpace={{ base: 'break-spaces', md: 'unset' }}
                >
                  {data.banner.message || '신규가입하고 3000원\n쿠폰 받아가세요!'}
                </Heading>
              </LinkOverlay>
            </Link>
            <Link href={data.banner.linkUrl}>
              <Image
                draggable={false}
                cursor="pointer"
                zIndex={1}
                position="absolute"
                right={{ base: 0, md: -5 }}
                top={{ base: -10, md: -5 }}
                src={data.banner.imageUrl}
                width={{ base: 120, md: 160, lg: 200 }}
                height={{ base: '80px', md: 120, lg: 140 }}
                layout="fixed"
              />
            </Link>
          </Flex>
        </SlideCustom>
      </Box>
    </LinkBox>
  );
}

export default ShoppingEventBanner;
