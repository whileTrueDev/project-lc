import { Box, Stack, Text } from '@chakra-ui/react';
import {
  howToUseSectionBody,
  SectionData,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { SellerMainSectionContainer } from './SellerMainFeatureSection';

/** 이용방법 이미지 영역 */
export function SellerMainHowToUseImage({
  selectedItem,
}: {
  selectedItem: SectionData;
}): JSX.Element {
  const { isMobileSize } = useDisplaySize(); // 750px 기점
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        style={{ display: 'inline-block', minWidth: isMobileSize ? '100%' : '70%' }}
        key={selectedItem.title || ''}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
      >
        {selectedItem.img && (
          <Box position="relative" maxW={{ base: '658px', md: '815px' }}>
            <ChakraNextImage
              layout="responsive"
              width={685}
              height={400}
              src={selectedItem.img}
              objectFit="contain"
              quality={100}
            />
          </Box>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

const variants = {
  selected: {
    color: 'var(--chakra-colors-whiteAlpha-900)',
    backgroundColor: 'var(--chakra-colors-blue-500)',
    transition: {
      default: { duration: 0.2 },
    },
  },
  notSelected: {},
};
/** 이용방법 아이템 텍스트 상자 */
export function SellerMainHowToUseItem({
  item,
  selected,
  onClick,
}: {
  item: SectionData;
  selected: boolean;
  onClick?: () => void;
}): JSX.Element | null {
  const { title, desc } = item;
  if (!title || !desc) return null;
  return (
    <Box cursor="pointer" _hover={{ color: 'blue.500' }}>
      <motion.div
        onClick={onClick}
        style={{ borderRadius: '1rem', padding: '1rem' }}
        variants={variants}
        initial="notSelected"
        animate={selected ? 'selected' : 'notSelected'}
      >
        <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
          {title}
        </Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} wordBreak="keep-all">
          {desc}
        </Text>
      </motion.div>
    </Box>
  );
}

/** 판매자 메인페이지 - 크크쇼 이용방법 섹션 */
export function SellerMainHowToUseSection(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<SectionData>(howToUseSectionBody[0]);
  return (
    <SellerMainSectionContainer sectionData={sellerMainSectionText.howToUse} hasGrayBg>
      <Stack
        spacing={8}
        alignItems="center"
        direction={{ base: 'column', md: 'row-reverse' }}
        pl={{ base: 0, md: 4 }}
        py={8}
      >
        {/* gif 이미지 영역 */}
        <SellerMainHowToUseImage selectedItem={selectedItem} />

        {/* 텍스트 상자 영역 */}
        <Stack overflow="hidden" spacing={0}>
          {howToUseSectionBody.map((item) => (
            <SellerMainHowToUseItem
              key={item.title}
              item={item}
              selected={item === selectedItem}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </Stack>
      </Stack>
    </SellerMainSectionContainer>
  );
}

export default SellerMainHowToUseSection;
