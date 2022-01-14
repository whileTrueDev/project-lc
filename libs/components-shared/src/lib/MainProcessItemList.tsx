import { ChevronRightIcon } from '@chakra-ui/icons';
import { GridItem, Box, Text, Flex, Stack } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';

export interface MainProcessItemListProps {
  processItems: { src: string; text: string }[];
}

const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// breakpoint에 따라 표시할 컬럼 개수
const GRID_COL_COUNT = {
  base: 2,
  md: 3,
  lg: 6,
};

/** 방송인, 판매자 메인페이지 절차(process) 영역 컴포넌트
 * @param processItems {src: string, text: string}[]
 * src: 이미지 url
 * text: 이미지에 대한 텍스트
 */
export function MainProcessItemList({
  processItems,
}: MainProcessItemListProps): JSX.Element {
  return (
    <MotionBox
      display="grid"
      gridTemplateColumns={{
        base: `repeat(${GRID_COL_COUNT.base}, 1fr)`,
        md: `repeat(${GRID_COL_COUNT.md}, 1fr)`,
        lg: `repeat(${GRID_COL_COUNT.lg}, 1fr)`,
      }}
      maxW="6xl"
      margin={[12, 'auto']}
      variants={boxVariants}
      viewport={{ once: true }}
      initial="hidden"
      whileInView="visible"
    >
      {processItems.map((item, idx) => (
        <GridItem key={item.src} colSpan={1} mb={4}>
          <MotionBox
            display="flex"
            flexDir={{ base: 'column', lg: 'row' }}
            justifyContent="center"
            alignItems="center"
            gap={8}
            variants={itemVariants}
            position="relative"
          >
            <Flex>
              <Stack alignItems="center">
                {/* 이미지 */}
                <Box
                  bgColor="white"
                  borderRadius="2xl"
                  p={4}
                  m={[0, 'auto']}
                  w={{ base: '80px', md: '113px' }}
                >
                  <ChakraNextImage
                    layout="responsive"
                    width={100}
                    height={100}
                    src={item.src}
                    objectFit="contain"
                  />
                </Box>

                {/* 글자 */}
                <Text mt={4} fontWeight="bold" wordBreak="keep-all" textAlign="center">
                  {item.text}
                </Text>
              </Stack>

              {/* > 표시 */}
              {!(idx === processItems.length - 1) && (
                <ChevronRightIcon
                  position="absolute"
                  display={{
                    base: 'none',
                    // md ~ lg : 아이템 순서가 GRID_COL_COUNT.md의 배수인경우 > 표시안함
                    md: (idx + 1) % GRID_COL_COUNT.md === 0 ? 'none' : 'block',
                    // lg ~ : 마지막 아이템인 경우 > 표시안함
                    lg: idx === processItems.length - 1 ? 'none' : 'block',
                  }}
                  right={{ base: '-1em' }}
                  top={{ base: 8, sm: 10 }}
                  boxSize={{ base: 8, sm: 10 }}
                />
              )}
            </Flex>
          </MotionBox>
        </GridItem>
      ))}
    </MotionBox>
  );
}

export default MainProcessItemList;
