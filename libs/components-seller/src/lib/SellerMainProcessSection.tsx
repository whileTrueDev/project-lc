import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Text, Flex, Stack, TextProps } from '@chakra-ui/react';
import {
  sellerMainSectionText,
  processSectionBody,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { motion } from 'framer-motion';
import { Fragment } from 'react';
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
      <Stack direction="row" pl={6}>
        {processSectionBody.map((item, index) => {
          const { title, img } = item;
          if (!title || !img) return null;
          return (
            <Fragment key={item.title}>
              <Stack alignItems="center" spacing={{ md: 4, lg: 6 }}>
                <Box w={{ md: '75px', lg: '100px' }} maxW="100px" maxH="100px">
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
                  <ChevronRightIcon boxSize="10" color="gray.700" />
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
