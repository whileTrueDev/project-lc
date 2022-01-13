import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { howToUseItems } from './broadcasterMainConstants';

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

export function BroadcasterMainHowToUse(): JSX.Element {
  const [selected, setSelected] = useState(0);
  function handleItemSelect(idx: number): void {
    setSelected(idx);
  }

  return (
    <MainSectionLayout
      _title="크크쇼 이용 방법"
      subtitle={'간단한 URL 등록 하나로\n판매와 홍보 이미지를 송출할 수 있습니다.'}
      whiteIndicator
      py={12}
      bgGradient="linear(to-b, blue.400, blue.500)"
      color="white"
    >
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
          <Stack spacing={4}>
            {howToUseItems.map((item, idx) => (
              <MotionBox
                key={item.title}
                onClick={() => handleItemSelect(idx)}
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
                  boxShadow={
                    selected === idx ? '0 0 0 0.2rem rgb(255, 255, 255, 0.5)' : undefined
                  }
                  transition="box-shadow ease-out 0.5s"
                />
                <Box
                  minH={20}
                  px={4}
                  py={2}
                  borderRadius="xl"
                  sx={{ transition: 'background-color 0.35s' }}
                  bgColor={selected === idx ? 'white' : 'unset'}
                  color={selected === idx ? 'WindowText' : 'unset'}
                  shadow={selected === idx ? 'xl' : 'unset'}
                >
                  <Text fontWeight="bold">{item.title}</Text>
                  <Text fontWeight="medium">{item.contents}</Text>
                </Box>
              </MotionBox>
            ))}
          </Stack>
        </MotionBox>

        <AnimatePresence>
          <Flex
            colSpan={{ base: 3, lg: 2 }}
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            flex={{ base: 1, lg: 2 }}
          >
            <MotionBox
              key={howToUseItems[selected].image}
              viewport={{ amount: 0.6, once: true }}
              initial="hidden"
              whileInView="visible"
              variants={previewVariants}
            >
              <ChakraNextImage
                src={howToUseItems[selected].image}
                height="400"
                width="700"
                borderRadius="2xl"
              />
            </MotionBox>
          </Flex>
        </AnimatePresence>
      </Flex>
    </MainSectionLayout>
  );
}

export default BroadcasterMainHowToUse;
