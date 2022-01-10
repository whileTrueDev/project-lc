import { Box, Container, Stack, Text } from '@chakra-ui/react';
import { sellerMainSectionText } from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

// 세세한 폰트사이즈는 하다가보면 겹치는거 나올테니 나중에 하고 일단 제플린 사이즈 토대로 만들자
export function SellerMainHeroTextSection(): JSX.Element {
  return (
    // base~ 750까지, md ~ 750 이상인경우 {base: , md:}
    <Box
      justifyContent="center"
      alignItems="center"
      color="white"
      height={{ base: '200px', sm: '200px' }}
      bgGradient="linear(to-b, blue.400, blue.600)"
      //  TODO: responsive background 적용 어떻게함?? 그냥 이미지로 넣음
    >
      <Container
        maxW="xl"
        overflow="hidden"
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ChakraNextImage
          position="absolute"
          layout="fill"
          maxWidth="1200px"
          objectFit={{ base: 'cover', xl: 'contain' }}
          src="/images/main/bg-circle/bg-circle.png"
        />
        <Text
          fontSize={{ base: 'lg', sm: '4xl' }}
          fontFamily="Gmarket Sans"
          fontWeight="bold"
        >
          {sellerMainSectionText.heroText.title}
        </Text>
        <Text fontSize={{ base: 'sm', sm: 'lg' }}>
          {sellerMainSectionText.heroText.desc}
        </Text>
      </Container>
    </Box>
  );
}

export function SellerMainHeroImageSection(): JSX.Element {
  return (
    <Stack>
      {/* <ChakraNextImage
        layout="fill"
        src="/images/main/bg-circle/bg-circle.png"
        srcset="/images/main/bg-circle/bg-circle@2x.png 2x,
              /images/main/bg-circle/bg-circle@3x.png 3x"
      /> */}
      <Text fontSize={{ base: 'sm', sm: 'lg' }}>
        {sellerMainSectionText.heroText.desc}
      </Text>
    </Stack>
  );
}

export function SellerMainHeader(): JSX.Element {
  return (
    <Box>
      <SellerMainHeroTextSection />
      <SellerMainHeroImageSection />
    </Box>
  );
}

export default SellerMainHeader;
