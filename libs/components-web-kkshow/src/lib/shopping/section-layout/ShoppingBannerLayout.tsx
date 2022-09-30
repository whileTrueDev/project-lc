import { Box, Flex, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react';
import SlideCustom from '@project-lc/components-layout/motion/SlideCustom';
import { KkshowShoppingTabBannerData } from '@project-lc/shared-types';
import Link from 'next/link';

export function ShoppingBannerLayout({
  message,
  link,
  imageUrl,
  fontColor,
  backgroundColor,
  backgroundRepeat,
  backgroundPosition,
  backgroundSize,
}: KkshowShoppingTabBannerData): JSX.Element | null {
  return (
    <LinkBox>
      <Box mx="auto" maxW="5xl" pt={5} pb={20}>
        <SlideCustom>
          <Flex
            color={fontColor || 'whiteAlpha.900'}
            mx={2}
            h={120}
            rounded="2xl"
            justify="center"
            alignItems="center"
            textAlign="center"
            position="relative"
            backgroundImage={imageUrl ? `url(${imageUrl})` : undefined}
            backgroundPosition={backgroundPosition}
            backgroundRepeat={backgroundRepeat || 'no-repeat'}
            backgroundSize={backgroundSize}
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              bgColor: backgroundColor || 'blue.500',
              zIndex: -1,
            }}
          >
            {link ? (
              <Link passHref href={link}>
                <LinkOverlay isExternal>
                  <Heading
                    zIndex={2}
                    fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                    whiteSpace={{ base: 'break-spaces', md: 'unset' }}
                  >
                    {message}
                  </Heading>
                </LinkOverlay>
              </Link>
            ) : (
              <Heading
                zIndex={2}
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                whiteSpace={{ base: 'break-spaces', md: 'unset' }}
              >
                {message}
              </Heading>
            )}
          </Flex>
        </SlideCustom>
      </Box>
    </LinkBox>
  );
}

export default ShoppingBannerLayout;
