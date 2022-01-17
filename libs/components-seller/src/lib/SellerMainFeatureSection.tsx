import { Stack, Text, useColorModeValue } from '@chakra-ui/react';
import {
  featureSectionBody,
  SectionData,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { SellerMainSectionContainer } from '@project-lc/components-layout/SellerMainSectionContainer';

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
      cursor="default"
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
