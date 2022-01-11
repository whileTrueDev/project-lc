import { Box, Text, Flex } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  processSectionBody,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { SellerMainSectionContainer } from './SellerMainFeatureSection';

/** 과정 이미지 : 모바일화면(750이하)일때  - 이미지라서 화면 작을때 글자가 흐리게 보임 */
export function SellerMainProcessImageMobile(): JSX.Element {
  return (
    <Box position="relative">
      <ChakraNextImage
        layout="responsive"
        width={700}
        height={432}
        src="/images/main/step-mobile/step.png"
        objectFit="cover"
        objectPosition="right"
      />
    </Box>
  );
}

/** 과정 이미지 : 데스크톱화면(750 이상)일때  
 * 
 //TODO : 텍스트만 애니메이션 적용 필요
 */
export function SellerMainProcessImageDeskTop(): JSX.Element {
  return (
    <Flex>
      {processSectionBody.map((item, index) => {
        const { title, img } = item;
        if (!title || !img) return null;
        return (
          <>
            <Box key={item.title} w="100px" h="100px">
              <ChakraNextImage
                layout="responsive"
                width={100}
                height={100}
                src={img}
                objectFit="contain"
              />
              <Text>{item.title}</Text>
            </Box>
            {index !== processSectionBody.length - 1 && <Text> &gt;</Text>}
          </>
        );
      })}
    </Flex>
  );
}

export function SellerMainProcessSection(): JSX.Element {
  const { isMobileSize } = useDisplaySize(); // 750px 기점
  return (
    <SellerMainSectionContainer sectionData={sellerMainSectionText.process}>
      {isMobileSize ? (
        <SellerMainProcessImageMobile />
      ) : (
        <SellerMainProcessImageDeskTop />
      )}
    </SellerMainSectionContainer>
  );
}

export default SellerMainProcessSection;
