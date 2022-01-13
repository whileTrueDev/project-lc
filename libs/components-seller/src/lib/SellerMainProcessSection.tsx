import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Text, Flex, Stack, TextProps, SimpleGrid } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  processSectionBody,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { motion } from 'framer-motion';
import { Fragment } from 'react';
import { SellerMainSectionContainer } from './SellerMainFeatureSection';

const container = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const text = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.2,
      duration: 1,
    },
  },
};

/** 과정 이미지 */
export function SellerMainProcessImageMobile(): JSX.Element {
  return (
    <motion.div
      variants={container}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      <SimpleGrid columns={3} py={4}>
        {processSectionBody.map((item, index) => {
          const { title, img } = item;
          if (!title || !img) return null;
          return (
            <Flex
              key={item.title}
              justifyContent={
                index === processSectionBody.length - 1 ? 'center' : 'flex-end'
              }
              mb={4}
            >
              <Stack alignItems="center" spacing={{ md: 4, lg: 6 }}>
                <Box
                  w={{ base: '60px', md: '75px', lg: '113px' }}
                  h={{ base: '60px', md: '75px', lg: '113px' }}
                  maxW="113px"
                  maxH="113px"
                >
                  <ChakraNextImage
                    layout="responsive"
                    width={100}
                    height={100}
                    src={img}
                    objectFit="contain"
                  />
                </Box>

                <MotionText
                  fontSize={{ base: 'sm', md: 'lg' }}
                  fontWeight="bold"
                  wordBreak="keep-all"
                  textAlign="center"
                  variants={text}
                >
                  {item.title}
                </MotionText>
              </Stack>

              {index !== processSectionBody.length - 1 && (
                <Box position="relative" top={{ base: '5', md: '10' }}>
                  <ChevronRightIcon
                    boxSize={{ base: '5', md: '10' }}
                    color="orange.900"
                  />
                </Box>
              )}
            </Flex>
          );
        })}
      </SimpleGrid>
    </motion.div>
  );
}

const MotionText = motion<TextProps>(Text);
/** 과정 이미지 : 데스크톱화면(750 이상)일때
 */

export function SellerMainProcessImageDeskTop(): JSX.Element {
  return (
    <motion.div
      variants={container}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 'all' }}
    >
      <Stack direction="row" p={8} justifyContent="space-around">
        {processSectionBody.map((item, index) => {
          const { title, img } = item;
          if (!title || !img) return null;
          return (
            <Fragment key={item.title}>
              <Stack alignItems="center" spacing={{ md: 4, lg: 6 }}>
                <Box w={{ md: '75px', lg: '113px' }} maxW="113px" maxH="113px">
                  <ChakraNextImage
                    layout="responsive"
                    width={100}
                    height={100}
                    src={img}
                    objectFit="contain"
                  />
                </Box>

                <MotionText
                  fontSize="lg"
                  fontWeight="bold"
                  wordBreak="keep-all"
                  textAlign="center"
                  variants={text}
                >
                  {item.title}
                </MotionText>
              </Stack>

              {index !== processSectionBody.length - 1 && (
                <Box position="relative" top="10">
                  <ChevronRightIcon boxSize="10" color="orange.900" />
                </Box>
              )}
            </Fragment>
          );
        })}
      </Stack>
    </motion.div>
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
