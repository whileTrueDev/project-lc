import { Box, SimpleGrid } from '@chakra-ui/react';
import {
  MAIN_IMAGE_PATH,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { motion } from 'framer-motion';
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

  const variants = {
    offscreen: { opacity: 0, y: 150, scale: 0.7 },
    onscreen: {
      y: isMobileSize ? 0 : -50,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 1.4,
      },
    },
  };
  return (
    <SellerMainSectionContainer
      sectionData={{
        title,
        desc,
      }}
    >
      <Box position="relative">
        {/* 후기 채팅 이미지 영역 */}
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

        {/* 강조문구 이미지  */}
        <motion.div
          style={{ display: 'inline-block', minWidth: '100%' }}
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 'all' }}
        >
          <Box maxW="690px" m={[0, 'auto']}>
            <ChakraNextImage
              layout="responsive"
              width={690}
              height={200}
              src={`${MAIN_IMAGE_PATH}/review/last/last.png`}
              objectFit="fill"
            />
          </Box>
        </motion.div>
      </Box>
    </SellerMainSectionContainer>
  );
}

export default SellerMainReviewSection;
