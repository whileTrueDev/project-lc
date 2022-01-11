import { SimpleGrid } from '@chakra-ui/react';
import {
  MAIN_IMAGE_PATH,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { useMemo } from 'react';
import { SellerMainSectionContainer } from './SellerMainFeatureSection';

// 모바일과 데스크톱 화면에서 표시되는 순서가 조금 달라서 order로 구분함
const chatImages = [
  {
    title: '닭강정대표님',
    img: `${MAIN_IMAGE_PATH}/review/chat-1/chat-1.webp`,
    order: {
      mobile: 1,
      desktop: 1,
    },
  },
  {
    title: '굴림만두대표님',
    img: `${MAIN_IMAGE_PATH}/review/chat-2/chat-2.webp`,
    order: {
      mobile: 2,
      desktop: 2,
    },
  },
  {
    title: '왕만두대표님',
    img: `${MAIN_IMAGE_PATH}/review/chat-3/chat-3.webp`,
    order: {
      mobile: 3,
      desktop: 4,
    },
  },
  {
    title: '먹pd님',
    img: `${MAIN_IMAGE_PATH}/review/chat-4/chat-4.webp`,
    order: {
      mobile: 4,
      desktop: 3,
    },
  },
];

export function SellerMainReviewSection(): JSX.Element {
  const { title, desc } = sellerMainSectionText.review;
  const { isMobileSize } = useDisplaySize();
  const chatImagesSorted = useMemo(() => {
    if (isMobileSize) {
      return chatImages.sort((a, b) => a.order.mobile - b.order.mobile);
    }
    return chatImages.sort((a, b) => a.order.desktop - b.order.desktop);
  }, [isMobileSize]);
  return (
    <SellerMainSectionContainer
      sectionData={{
        title,
        desc,
      }}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        {chatImagesSorted.map((item) => {
          return (
            <ChakraNextImage
              key={item.title}
              layout="responsive"
              maxW="600px"
              width={600}
              height={600}
              src={item.img}
              objectFit="contain"
            />
          );
        })}
      </SimpleGrid>
    </SellerMainSectionContainer>
  );
}

export default SellerMainReviewSection;
