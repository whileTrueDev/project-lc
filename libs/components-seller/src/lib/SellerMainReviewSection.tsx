import { Box, Container, GridItem } from '@chakra-ui/react';
import {
  chatImages,
  MAIN_IMAGE_PATH,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import MotionBox from '@project-lc/components-core/MotionBox';
import { SellerMainSectionContainer } from '@project-lc/components-layout/SellerMainSectionContainer';
import { useDisplaySize } from '@project-lc/hooks';
import { useMemo } from 'react';

export const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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
    offscreen: { opacity: 0, y: 50, scale: 0.7 },
    onscreen: {
      y: isMobileSize ? 0 : -50,
      opacity: 1,
      scale: isMobileSize ? 1.1 : 1,
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
        <MotionBox
          display="grid"
          variants={boxVariants}
          viewport={{ once: true }}
          initial="hidden"
          whileInView="visible"
          gridTemplateColumns={{
            base: `repeat(1, 1fr)`,
            lg: `repeat(2, 1fr)`,
          }}
          gridGap={4}
        >
          {chatImagesSorted.map((item) => {
            const x = 540;
            const y = 583;
            return (
              <GridItem colSpan={1} mb={4} key={item.title}>
                <MotionBox
                  variants={itemVariants}
                  viewport={{ once: true }}
                  initial="hidden"
                  whileInView="visible"
                  position="relative"
                  maxW={`${x}px`}
                  m={[0, 'auto']}
                  borderRadius="2xl"
                  boxShadow="lg"
                  bg="gray.50"
                >
                  <ChakraNextImage
                    width={x}
                    height={y}
                    src={item.img}
                    borderRadius="2xl"
                    placeholder="empty"
                  />
                </MotionBox>
              </GridItem>
            );
          })}
        </MotionBox>

        {/* 강조문구 이미지  */}

        <MotionBox
          style={{ display: 'inline-block', minWidth: '100%' }}
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <Box
            maxW={{ base: '690px', md: '883px' }}
            m={[0, 'auto']}
            borderRadius="2xl"
            boxShadow="dark-lg"
          >
            <ChakraNextImage
              layout="responsive"
              width={1200}
              height={340}
              src={`${MAIN_IMAGE_PATH}/review/last.jpg`}
              borderRadius="2xl"
            />
          </Box>
        </MotionBox>
      </Container>
    </SellerMainSectionContainer>
  );
}

export default SellerMainReviewSection;
