import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, GridItem, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { processItems } from './broadcasterMainConstants';

const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function BroadcasterMainProcess(): JSX.Element {
  return (
    <MainSectionLayout
      subtitle={'라이브 쇼핑의 처음부터 끝까지\n전문 매니저가 1:1로 전담하여 진행합니다.'}
      _title={'편하게 방송만 할 수 있도록\n크크쇼에서 모두 해결하겠습니다.'}
      py={12}
    >
      <MotionBox
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          xl: 'repeat(6, 1fr)',
        }}
        maxW="6xl"
        margin="auto"
        my={12}
        gap={8}
        variants={boxVariants}
        viewport={{ once: true }}
        initial="hidden"
        whileInView="visible"
      >
        {processItems.map((item, idx) => (
          <GridItem key={item.src} colSpan={1}>
            <MotionBox
              display="flex"
              flexDir={{ base: 'column', xl: 'row' }}
              justifyContent="flex-start"
              alignItems="center"
              gap={8}
              variants={itemVariants}
            >
              <Box textAlign="center">
                <Box bgColor="white" borderRadius="2xl" p={4} w="100px" h="100px">
                  <ChakraNextImage src={item.src} width={80} height={80} />
                </Box>
                <Text mt={4} fontWeight="bold">
                  {item.text}
                </Text>
              </Box>
              {!(idx === processItems.length - 1) && (
                <ChevronRightIcon
                  display={{ base: 'none', xl: 'flex' }}
                  w={8}
                  height={8}
                />
              )}
            </MotionBox>
          </GridItem>
        ))}
      </MotionBox>
    </MainSectionLayout>
  );
}

export default BroadcasterMainProcess;
