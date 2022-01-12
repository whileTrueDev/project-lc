import {
  Box,
  BoxProps,
  Container,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  featureSectionBody,
  SectionData,
  sellerMainSectionText,
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
  hasGrayBg = false,
}: {
  hasGrayBg?: boolean;
  children?: React.ReactNode;
  sectionData: SectionData;
  bgProps?: BoxProps;
}): JSX.Element {
  const { title, desc } = sectionData;
  const grayBg = useColorModeValue('gray.50', 'gray.700');

  return (
    // 배경 컨테이너
    <Box
      py={{ base: 10, sm: 14, xl: 20 }}
      position="relative"
      overflow="hidden"
      bg={hasGrayBg ? grayBg : undefined}
      {...bgProps}
    >
      {/* 실제 컨텐츠 영역(최대너비 1200px임, breakpoint는 xl(1280px) 사용) */}
      <Container maxW="container.xl" position="relative">
        <Stack spacing={{ base: 6, sm: 8 }} position="relative">
          <Box
            pl={{ base: 0, md: '1.5rem' }}
            textAlign={{ base: 'center', md: 'left' }}
            position="relative"
          >
            <FadeInBar />

            <Stack wordBreak="keep-all">
              {title && (
                <Text
                  fontFamily="Gmarket Sans"
                  fontWeight="bold"
                  lineHeight="shorter"
                  whiteSpace="pre-line"
                  fontSize={{ base: '2xl', sm: '3xl' }}
                >
                  {title}
                </Text>
              )}
              {desc && (
                <Text
                  whiteSpace={{ base: 'pre-line', md: 'normal' }}
                  wordBreak="keep-all"
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
    </Box>
  );
}

/** 크크쇼 판매자센터 특징 아이템 */
export function SellerMainFeatureItem({ item }: { item: SectionData }): JSX.Element {
  const { title: subTitle, desc } = item;
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.700')}
      maxW="1200px"
      px={{ base: 6, md: 20 }}
      py={{ base: 6, md: 10 }}
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      textAlign={{ base: 'center', md: 'left' }}
      fontWeight="medium"
      borderRadius="82.5px"
      boxShadow={useColorModeValue('md', 'lg')}
      _hover={{
        boxShadow: useColorModeValue('xl', 'dark-lg'),
        scale: 1.1,
      }}
      transition="all 0.3s ease-in-out"
      wordBreak="keep-all"
    >
      <Text
        fontSize={{ base: 'lg', md: 'xl' }}
        color={useColorModeValue('blue.500', 'blue.300')}
        fontFamily="Gmarket Sans"
        w={{ base: '100%', md: '30%' }}
      >
        {subTitle}
      </Text>
      <Text w={{ base: '100%', md: '70%' }} fontSize={{ base: 'sm', sm: 'lg' }}>
        {desc}
      </Text>
    </Stack>
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
      hasGrayBg
      bgProps={{
        // 배경에 들어가는 KKS 글자 이미지로 맞추기 힘들어서 가상요소로 넣음
        _before: {
          content: `"KKS"`,
          fontFamily: 'Gmarket Sans',
          fontWeight: 'bold',
          display: 'block',
          fontSize: { base: '15rem', md: '20rem' },
          color: useColorModeValue('gray.200', 'gray.600'),
          opacity: 0.3,
          right: '-0.4em',
          bottom: '-0.3em',
          position: 'absolute',
        },
      }}
    >
      {featureSectionBody.map((item) => (
        <SellerMainFeatureItem item={item} key={item.title} />
      ))}
    </SellerMainSectionContainer>
  );
}

export default SellerMainFeatureSection;
