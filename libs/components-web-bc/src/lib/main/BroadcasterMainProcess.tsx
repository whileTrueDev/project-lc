import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { useDisplaySize } from '@project-lc/hooks';

const boxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export function BroadcasterMainProcess(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const items = [
    { src: '/images/main/sv_icon1.png', text: '스케쥴 조율' },
    { src: '/images/main/sv_icon2.png', text: '컨텐츠 기획' },
    { src: '/images/main/sv_icon3.png', text: '홍보물 제작' },
    { src: '/images/main/sv_icon4.png', text: 'SNS 홍보' },
    { src: '/images/main/sv_icon5.png', text: '리허설' },
    { src: '/images/main/sv_icon6.png', text: '본 방송 리드' },
  ];
  return (
    <MainSectionLayout
      subtitle="라이브 쇼핑의 처음부터 끝까지 전문 매니저가 1:1로 전담하여 진행합니다."
      _title={{
        mobile: '편하게 방송만\n할 수 있도록\n크크쇼에서\n모두 해결하겠습니다.',
        pc: '편하게 방송만 할 수 있도록\n크크쇼에서 모두 해결하겠습니다.',
      }}
      py={12}
    >
      <MotionBox
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: 'repeat(6, 1fr)' }}
        maxW="6xl"
        margin="auto"
        my={12}
        gap={8}
        initial="hidden"
        whileInView="visible"
        variants={boxVariants}
        viewport={{ once: !isDesktopSize }}
      >
        {items.map((item, idx) => (
          <MotionBox
            display="flex"
            flexDir={{ base: 'column', lg: 'row' }}
            justifyContent="flex-start"
            alignItems="center"
            key={item.src}
            gap={8}
            variants={itemVariants}
            initial={itemVariants.hidden}
            whileInView={{ ...itemVariants.visible, transition: { duration: 1 } }}
          >
            <Box textAlign="center">
              <Box bgColor="white" borderRadius="2xl" p={2}>
                <ChakraNextImage src={item.src} width={80} height={80} />
              </Box>
              <Text mt={4} fontWeight="bold">
                {item.text}
              </Text>
            </Box>
            {!(idx === items.length - 1) && (
              <ChevronRightIcon
                display={{ base: 'none', lg: 'flex' }}
                w="20px"
                height="20px"
              />
            )}
          </MotionBox>
        ))}
      </MotionBox>
    </MainSectionLayout>
  );
}

export default BroadcasterMainProcess;
