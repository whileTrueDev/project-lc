import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import {
  howToUseSectionBody,
  SectionData,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import SellerMainSectionContainer from '@project-lc/components-layout/SellerMainSectionContainer';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};
const previewVariants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** 이용방법 이미지 영역 */
export function SellerMainHowToUseImage({
  selectedItem,
}: {
  selectedItem: SectionData;
}): JSX.Element {
  return (
    <AnimatePresence>
      <Flex
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flex={{ base: 1, lg: 2 }}
      >
        <MotionBox
          key={selectedItem.title || ''}
          viewport={{ amount: 0.6, once: true }}
          initial="hidden"
          whileInView="visible"
          variants={previewVariants}
        >
          {selectedItem.img && (
            <ChakraNextImage
              src={selectedItem.img}
              quality={100}
              width={685}
              height={400}
            />
          )}
        </MotionBox>
      </Flex>
    </AnimatePresence>
  );
}

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
    <MotionBox
      onClick={onClick}
      cursor="pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.99 }}
      display="flex"
      alignItems="center"
      gap={2}
    >
      <Box
        width="12px"
        height="12px"
        bgColor="blue.500"
        borderRadius="full"
        boxShadow={selected ? '0 0 0 0.2rem rgb(80, 120, 255, 0.5)' : undefined}
        transition="box-shadow ease-out 0.5s"
      />
      <Box
        minH={20}
        flex={1}
        px={4}
        py={2}
        borderRadius="xl"
        sx={{ transition: 'background-color 0.35s' }}
        bgColor={selected ? 'blue.500' : 'unset'}
        color={selected ? 'white' : 'unset'}
        shadow={selected ? 'xl' : 'unset'}
      >
        <Text fontWeight="bold">{item.title}</Text>
        <Text fontWeight="medium">{item.desc}</Text>
      </Box>
    </MotionBox>
  );
}

/** 판매자 메인페이지 - 크크쇼 이용방법 섹션 */
export function SellerMainHowToUseSection(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<SectionData>(howToUseSectionBody[0]);
  return (
    <SellerMainSectionContainer sectionData={sellerMainSectionText.howToUse} hasGrayBg>
      <Flex
        maxW="6xl"
        margin="auto"
        my={12}
        gap={8}
        justify="space-between"
        alignItems={{ base: 'center', lg: 'center' }}
        flexDir={{ base: 'column-reverse', lg: 'row' }}
      >
        {/* 텍스트 상자 영역 */}
        <MotionBox
          variants={boxVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.6, once: true }}
          flex={1}
        >
          <Stack spacing={4}>
            {howToUseSectionBody.map((item) => (
              <SellerMainHowToUseItem
                key={item.title}
                item={item}
                selected={item === selectedItem}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </Stack>
        </MotionBox>

        {/* gif 이미지 영역 */}
        <SellerMainHowToUseImage selectedItem={selectedItem} />
      </Flex>
    </SellerMainSectionContainer>
  );
}

export default SellerMainHowToUseSection;
