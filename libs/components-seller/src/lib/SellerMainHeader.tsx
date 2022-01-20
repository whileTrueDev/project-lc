import { Box, Center, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { sellerMainSectionText } from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

// contents maxWidth : 시안에는 1200px인데 container.xl로 적용함

/** 판매자 센터 적혀있는 파란 배너 부분 */
export function SellerMainHeroTextSection(): JSX.Element {
  const { title, desc } = sellerMainSectionText.heroText;
  return (
    // 섹션 공통 구조
    // 배경 -> 컨테이너(최대 너비제한, center) -> 실제컨텐츠
    // base~ 750까지, md ~ 750 이상인경우 {base: , md:}
    <Box
      color="white"
      height={{ base: '150px', sm: '200px' }}
      bgGradient="linear(to-b, blue.400, blue.600)"
    >
      {/* 이미지 너비 제한하기 위해 컨테이터 추가함 */}
      <Container
        maxW="container.xl"
        overflow="hidden"
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundImage={`url('/images/main/bg-circle/bg-circle.png')`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Text
          fontSize={{ base: '3xl', sm: '4xl' }}
          fontFamily="Gmarket Sans"
          fontWeight="bold"
        >
          {title}
        </Text>
        <Text fontSize={{ base: 'sm', sm: 'lg' }} fontWeight="500">
          {desc}
        </Text>
      </Container>
    </Box>
  );
}

/** 판매자 센터 적혀있는 파란 배너 부분아래 티비 아이콘 부분 */
export function SellerMainHeroImageSection(): JSX.Element {
  const { title, desc, img } = sellerMainSectionText.heroImage;
  return (
    <Stack textAlign="center" py={10}>
      <Center w="100%">
        {img && (
          <Box w={{ base: 100, sm: 150 }} h={{ base: 100, sm: 150 }} position="relative">
            <ChakraNextImage layout="fill" src={img} left="50%" />
          </Box>
        )}
      </Center>

      <Box>
        <Text
          color="blue.500"
          fontSize={{ base: '3xl', sm: '4xl' }}
          fontWeight="bold"
          fontFamily="Gmarket Sans"
        >
          {title}
        </Text>
        <Text
          color={useColorModeValue('gray.600', 'gray.200')}
          fontSize={{ base: 'md', sm: 'lg' }}
        >
          {desc}
        </Text>
      </Box>
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
