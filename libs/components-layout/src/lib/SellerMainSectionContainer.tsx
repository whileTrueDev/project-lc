import { BoxProps, Container, Stack, useColorModeValue } from '@chakra-ui/react';
import { SectionData } from '@project-lc/components-constants/sellerMainText';
import MainSectionLayout from './MainSectionLayout';

/** 크크쇼 판매자센터 메인페이지 섹션 공용 레이아웃 컴포넌트
 * MainSectionLayout 과 완전히 동일하지 않아서 덮어씀
 */
export function SellerMainSectionContainer({
  children,
  sectionData,
  bgProps,
  hasGrayBg = false,
}: {
  hasGrayBg?: boolean;
  children: React.ReactChild | React.ReactChild[];
  sectionData: SectionData;
  bgProps?: BoxProps;
}): JSX.Element {
  const { title, desc } = sectionData;
  const grayBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <MainSectionLayout
      _title={title || ''}
      subtitle={desc}
      bg={hasGrayBg ? grayBg : undefined}
      py={{ base: 10, sm: 14 }}
      position="relative"
      overflow="hidden"
      {...bgProps}
    >
      <Container maxW="container.xl" position="relative">
        <Stack spacing={{ base: 6, sm: 8 }} position="relative">
          {children}
        </Stack>
      </Container>
    </MainSectionLayout>
  );
}

export default SellerMainSectionContainer;
