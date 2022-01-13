import { Box, Container, SimpleGrid, Stack, Text } from '@chakra-ui/react';
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
import MotionBox from '@project-lc/components-core/MotionBox';
import { StarIcon } from '@chakra-ui/icons';

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
        <MotionBox
          style={{ display: 'inline-block', minWidth: '100%' }}
          bg="blue.500"
          color="white"
          textAlign="center"
          borderRadius="2xl"
          p={[14, 8]}
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          userSelect="none"
        >
          <Box maxW={{ base: '690px', md: '883px' }} m={[0, 'auto']}>
            <Stack direction="row" justifyContent="center">
              <StarIcon boxSize={6} color="orange.200" />
              <StarIcon boxSize={6} color="orange.200" />
              <StarIcon boxSize={6} color="orange.200" />
              <StarIcon boxSize={6} color="orange.200" />
              <StarIcon boxSize={6} color="orange.200" />
            </Stack>

            <Text fontSize="3xl" fontFamily="Gmarket Sans" fontWeight="bold">
              한 번으로 끝내기엔 아쉬운 크크쇼 라이브!
            </Text>
            <Text fontSize="md">
              벌써 많은 업체들이 저희를 믿고 라이브 커머스를 통해 제품을 판매하고 있으며,
              <br />
              거의 대부분의 업체들이 재진행을 희망하고 있습니다.
            </Text>
          </Box>
        </MotionBox>
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
              width={1200}
              height={340}
              src={`${MAIN_IMAGE_PATH}/review/last.jpg`}
              borderRadius="2xl"
            />
          </Box>
        </motion.div>
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
              width={1200}
              height={340}
              src={`${MAIN_IMAGE_PATH}/review/last/last.png`}
              borderRadius="2xl"
            />
          </Box>
        </motion.div>
      </Container>
    </SellerMainSectionContainer>
  );
}

export default SellerMainReviewSection;
