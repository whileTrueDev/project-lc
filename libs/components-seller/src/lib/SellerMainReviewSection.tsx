import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import {
  MAIN_IMAGE_PATH,
  sellerMainSectionText,
  chatImages,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { SellerMainSectionContainer } from '@project-lc/components-layout/SellerMainSectionContainer';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

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
      <Container maxW="container.xl" position="relative">
        {/* 후기 채팅 이미지 영역 */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {chatImagesSorted.map((item) => {
            const x = 540;
            const y = 583;
            return (
              <Box key={item.title} position="relative" maxW={`${x}px`} m={[0, 'auto']}>
                <ChakraNextImage width={x} height={y} src={item.img} borderRadius="2xl" />
              </Box>
            );
          })}
        </SimpleGrid>

        {/* 강조문구 이미지  */}
        <motion.div
          style={{ display: 'inline-block', minWidth: '100%' }}
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <Box maxW={{ base: '690px', md: '883px' }} m={[0, 'auto']}>
            <ChakraNextImage
              layout="responsive"
              width={904}
              height={277}
              src={`${MAIN_IMAGE_PATH}/review/last/last.png`}
              objectFit="fill"
              quality={100}
            />
          </Box>
        </motion.div>
      </Container>
    </SellerMainSectionContainer>
  );
}

export default SellerMainReviewSection;
