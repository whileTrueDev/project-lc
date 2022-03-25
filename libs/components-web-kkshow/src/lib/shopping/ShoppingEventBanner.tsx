import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import SlideCustom from '@project-lc/components-layout/motion/SlideCustom';

export function ShoppingEventBanner(): JSX.Element {
  return (
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
          <Heading
            zIndex={2}
            fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
            whiteSpace={{ base: 'break-spaces', md: 'unset' }}
          >{`신규가입하고 3000원\n쿠폰 받아가세요!`}</Heading>
          <Image
            zIndex={1}
            position="absolute"
            right={{ base: 0, md: -5 }}
            top={{ base: -10, md: -5 }}
            src="/images/shopping/coupon.png"
            width={{ base: 120, md: 160, lg: 200 }}
            height={{ base: '80px', md: 120, lg: 140 }}
            layout="fixed"
          />
        </Flex>
      </SlideCustom>
    </Box>
  );
}

export default ShoppingEventBanner;
