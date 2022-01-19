import { Box, Flex, Stack, BoxProps, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import MotionBox from '@project-lc/components-core/MotionBox';
import { AnimatePresence } from 'framer-motion';
import { Key } from 'react';

export const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
export const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};
export const previewVariants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** 메인페이지 이용방법 영역에서 텍스트 목록에서 아이템 표시하기 위한 컴포넌트
 * <MainHowToUse> 자식 컴포넌트로 사용한다
 * @param onClick  아이템 클릭 핸들러
 * @param isSelected  해당 아이템이 선택되었는지 여부
 * @param indicatorBoxProps 왼쪽 동그라미 박스에 적용할 스타일, props 지정
 * @param textContainerBoxProps 텍스트 표시될 박스에 적용할 스타일, props 지정
 * @param title 아이템 제목
 * @param contents 아이템 내용
 */
export function MainHowToUseItem({
  onClick,
  isSelected,
  indicatorBoxProps,
  textContainerBoxProps,
  title,
  contents,
}: {
  onClick: () => void;
  isSelected: boolean;
  indicatorBoxProps?: BoxProps;
  textContainerBoxProps?: BoxProps;
  title: string;
  contents: string;
}): JSX.Element {
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
        bgColor="white"
        borderRadius="full"
        transition="box-shadow ease-out 0.5s"
        {...indicatorBoxProps}
      />
      <Box
        minH={20}
        px={4}
        py={2}
        borderRadius="xl"
        sx={{ transition: 'background-color 0.35s' }}
        shadow={isSelected ? 'xl' : 'unset'}
        {...textContainerBoxProps}
      >
        <Text fontWeight="bold">{title}</Text>
        <Text fontWeight="medium">{contents}</Text>
      </Box>
    </MotionBox>
  );
}

export interface MainHowToUseProps {
  children?: React.ReactNode;
  imageKey?: Key | null | undefined;
  imageSrc: string;
}
/**
 * 메인페이지 이용방법 - 클릭 가능한 텍스트 목록과 그에 해당하는 이미지 보여주는 컴포넌트
 * @param children <MainHowToUseItem> 컴포넌트를 이용해 텍스트 목록을 렌더링한다
 * @param imageKey 이미지 식별하기 위한 string 아무거나
 * @param imageSrc 표시할 이미지 url
 */
export function MainHowToUse({
  children,
  imageKey,
  imageSrc,
}: MainHowToUseProps): JSX.Element {
  return (
    <Flex
      maxW="6xl"
      margin="auto"
      my={12}
      px={4}
      gap={8}
      justify="space-between"
      alignItems={{ base: 'center', lg: 'center' }}
      flexDir={{ base: 'column-reverse', lg: 'row' }}
    >
      <MotionBox
        variants={boxVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.6, once: true }}
        flex={1}
      >
        <Stack spacing={4}>{children}</Stack>
      </MotionBox>

      <AnimatePresence>
        <Flex
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          flex={{ base: 1, lg: 2 }}
        >
          <MotionBox
            key={imageKey}
            viewport={{ amount: 0.6, once: true }}
            initial="hidden"
            whileInView="visible"
            variants={previewVariants}
          >
            <ChakraNextImage src={imageSrc} height="400" width="700" borderRadius="2xl" />
          </MotionBox>
        </Flex>
      </AnimatePresence>
    </Flex>
  );
}

export default MainHowToUse;
