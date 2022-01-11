import { Stack, Text, Box, Flex, Container } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  featureSectionBody,
  SectionData,
} from '@project-lc/components-constants/sellerMainText';
import { motion } from 'framer-motion';

export function SellerMainFeatureItem({ item }: { item: SectionData }): JSX.Element {
  const { title: subTitle, desc } = item;
  return (
    <Flex
      bg="white"
      maxW="1200px"
      px={{ base: 6, md: 20 }}
      py={{ base: 6, md: 10 }}
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      textAlign={{ base: 'center', md: 'left' }}
      fontWeight="medium"
      borderRadius="82.5px"
      boxShadow="sm"
      _hover={{
        boxShadow: 'lg',
        scale: 1.1,
      }}
      transition="all 0.3s ease-in-out"
    >
      <Text
        fontSize={{ base: 'lg', sm: 'md' }}
        color="blue.500"
        fontFamily="Gmarket Sans"
        w={{ base: '100%', md: '30%' }}
      >
        {subTitle}
      </Text>
      <Text w={{ base: '100%', md: '70%' }} fontSize={{ base: 'sm', sm: 'lg' }}>
        {desc}
      </Text>
    </Flex>
  );
}

export function FadeInBar(): JSX.Element {
  return (
    <Box
      position={{ base: 'relative', xl: 'absolute' }}
      left={{ base: 0, xl: '-80px' }}
      top={{ base: 0, xl: '1.5rem' }}
      w="80px"
      height="5px"
      display="inline-block"
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--chakra-colors-blue-500)',
        }}
        initial={{
          right: '100%',
          opacity: 0,
        }}
        whileInView={{
          right: 0,
          opacity: 1,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        viewport={{ once: true }}
      />
    </Box>
  );
}

/**
 * @returns 크크쇼 특징 섹션
 */
export function SellerMainFeatureSection(): JSX.Element {
  const { title } = sellerMainSectionText.feature;
  return (
    // 배경
    <Stack
      bg="gray.50"
      py={{ base: 10, sm: 14 }}
      // TODO: 반응형일시 배경이미지 위치 어떻게 할지 생각 텍스트인데 pseudo element로 넣으면 안되려나??
      backgroundImage={`url('/images/main/feature-bg-mobile/bg.png')`}
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      backgroundPosition="bottom right"
    >
      {/* maxWidth container */}
      <Container maxW="container.xl">
        <Stack spacing={{ base: 6, sm: 8 }}>
          <Box
            pl={{ base: 0, md: '1.5rem' }}
            textAlign={{ base: 'center', md: 'left' }}
            position="relative"
          >
            <FadeInBar />
            <Text
              fontFamily="Gmarket Sans"
              fontWeight="bold"
              whiteSpace="pre-line"
              fontSize={{ base: '2xl', sm: '4xl' }}
            >
              {title}
            </Text>
          </Box>
          {featureSectionBody.map((item) => (
            <SellerMainFeatureItem item={item} key={item.title} />
          ))}
        </Stack>
      </Container>
    </Stack>
  );
}

export default SellerMainFeatureSection;
