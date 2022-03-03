import { Box, Flex, Heading } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';

export function KkshowMainPlusFriend(): JSX.Element {
  return (
    <MotionBox
      py={20}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ once: true }}
    >
      <Flex
        p={4}
        color="whiteAlpha.900"
        bgColor="blue.500"
        h={120}
        maxW="5xl"
        m="0 auto"
        justify="center"
        align="center"
      >
        <Heading fontSize={{ base: 'lg', md: '2xl' }}>
          크크쇼랑 플친 맺고 다양한 혜택과 소식 받아보세요!
        </Heading>
        <Box
          w={260}
          h={120}
          backgroundImage="url(images/main/mockup.png)"
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="bottom right"
        />
      </Flex>
    </MotionBox>
  );
}

export default KkshowMainPlusFriend;
