import { Stack, Text, Box, Flex, Container } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  featureSectionBody,
} from '@project-lc/components-constants/sellerMainText';
/**
 *
 * @returns 사장님의 마케팅을 확실하고~ 섹션
 */
export function SellerMainFeatureSection(): JSX.Element {
  const { title } = sellerMainSectionText.feature;
  return (
    // 배경
    <Stack bg="gray.50" py={{ base: 10, sm: 14 }}>
      {/* maxWidth container */}
      <Container maxW="container.xl">
        <Stack spacing={{ base: 6, sm: 8 }}>
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Box w="80px" height="5px" bg="blue.500" display="inline-block" />
            <Text
              fontSize={{ base: '2xl', sm: '4xl' }}
              fontFamily="Gmarket Sans"
              fontWeight="bold"
              whiteSpace="pre-line"
            >
              {title}
            </Text>
          </Box>
          {featureSectionBody.map((item) => {
            const { title: subTitle, desc } = item;
            return (
              <Flex
                key={subTitle}
                bg="white"
                maxW="1200px"
                p={{ base: 6, sm: 8 }}
                direction={{ base: 'column', md: 'row' }}
                textAlign="center"
                fontWeight="medium"
                borderRadius="82.5px"
              >
                <Text
                  fontSize={{ base: 'lg', sm: 'md' }}
                  color="blue.500"
                  fontFamily="Gmarket Sans"
                >
                  {subTitle}
                </Text>
                <Text fontSize={{ base: 'sm', sm: 'lg' }}>{desc}</Text>
              </Flex>
            );
          })}
        </Stack>
      </Container>
    </Stack>
  );
}

export default SellerMainFeatureSection;
