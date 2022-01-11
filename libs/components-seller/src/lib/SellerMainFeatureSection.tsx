import { Stack, Text, Box, Flex, Container, StackProps } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  featureSectionBody,
  SectionData,
} from '@project-lc/components-constants/sellerMainText';
import { motion } from 'framer-motion';
import React from 'react';

/** 크크쇼 판매자센터 메인 섹션 타이틀 옆 애니메이션 막대 */
export function FadeInBar(): JSX.Element {
  return (
    <Box
      position={{ base: 'relative', xl: 'absolute' }}
      left={{ base: 0, xl: '-80px' }}
      top={{ base: '-0.5rem', xl: '1.5rem' }}
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

/** 크크쇼 판매자센터 메인페이지 섹션 공용 레이아웃 컴포넌트 */
export function SellerMainSectionContainer({
  children,
  sectionData,
  bgProps,
}: {
  children?: React.ReactNode;
  sectionData: SectionData;
  bgProps?: StackProps;
}): JSX.Element {
  const { title, desc } = sectionData;
  return (
    // 컨테이너 배경이 되는 부분
    <Stack py={{ base: 10, sm: 14 }} {...bgProps}>
      {/* 실제 컨텐츠 영역(최대너비 1200px임, breakpoint는 xl(1280px) 사용) */}
      <Container maxW="container.xl">
        <Stack spacing={{ base: 6, sm: 8 }}>
          <Box
            pl={{ base: 0, md: '1.5rem' }}
            textAlign={{ base: 'center', md: 'left' }}
            position="relative"
          >
            <FadeInBar />
            <Stack>
              {title && (
                <Text
                  fontFamily="Gmarket Sans"
                  fontWeight="bold"
                  lineHeight="shorter"
                  whiteSpace="pre-line"
                  fontSize={{ base: '2xl', sm: '4xl' }}
                >
                  {title}
                </Text>
              )}
              {desc && (
                <Text
                  whiteSpace={{ base: 'pre-line', md: 'normal' }}
                  fontSize={{ base: 'sm', sm: 'lg' }}
                >
                  {desc}
                </Text>
              )}
            </Stack>
          </Box>
          {children}
        </Stack>
      </Container>
    </Stack>
  );
}

/** 크크쇼 판매자센터 특징 아이템 */
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

/** 판매자센터 특징 섹션 */
export function SellerMainFeatureSection(): JSX.Element {
  const { title } = sellerMainSectionText.feature;
  return (
    <SellerMainSectionContainer
      sectionData={{
        title,
      }}
      bgProps={{
        bg: 'gray.50',
        backgroundImage: `url('/images/main/feature-bg-mobile/bg.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'bottom right',
      }}
    >
      {featureSectionBody.map((item) => (
        <SellerMainFeatureItem item={item} key={item.title} />
      ))}
    </SellerMainSectionContainer>
  );
}

export default SellerMainFeatureSection;
