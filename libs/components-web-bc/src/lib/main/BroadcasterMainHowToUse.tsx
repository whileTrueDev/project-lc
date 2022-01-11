import { Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

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
  const items = useMemo(
    () => [
      {
        title: 'URL 삽입',
        contents: '발급된 URL을 복사하여 송출 프로그램에 붙여넣습니다.',
        image: '/images/main/bc_htu_gif1.gif',
      },
      {
        title: '라이브 진행',
        contents: '라이브 송출 화면을 활용하여 방송을 진행합니다',
        image: '/images/main/bc_htu_gif2.gif',
      },
      {
        title: '수익금 적립',
        contents: '판매수익금, 응원메시지를 확인할 수 있습니다.',
        image: '/images/main/bc_htu_gif3.gif',
      },
      {
        title: '정산 관리',
        contents: '정산 등록 후 쌓인 수익금이 자동으로 정산됩니다.',
        image: '/images/main/bc_htu_gif4.gif',
      },
    ],
    [],
  );

  const [selected, setSelected] = useState(0);
  function handleItemSelect(idx: number): void {
    setSelected(idx);
  }

  return (
    <MainSectionLayout
      _title="크크쇼 이용 방법"
      subtitle="간단한 URL 등록 하나로 판매와 홍보 이미지를 송출할 수 있습니다."
      whiteIndicator
      py={12}
      bgGradient="linear(to-b, blue.400, blue.500)"
      color="white"
    >
      <Grid
        templateColumns="repeat(3,1fr)"
        maxW="6xl"
        margin="auto"
        my={12}
        px={4}
        gap={8}
        justify="space-between"
        alignItems="center"
      >
        <GridItem colSpan={{ base: 3, lg: 1 }}>
          <MotionBox
            variants={boxVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.6 }}
          >
            <Stack>
              {items.map((item, idx) => (
                <MotionBox
                  key={item.title}
                  onClick={() => handleItemSelect(idx)}
                  px={4}
                  py={2}
                  sx={{ transition: 'background-color 0.35s' }}
                  borderRadius="xl"
                  cursor="pointer"
                  bgColor={selected === idx ? 'white' : 'unset'}
                  color={selected === idx ? 'WindowText' : 'unset'}
                  shadow={selected === idx ? 'xl' : 'unset'}
                  minH={24}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Text fontWeight="bold">{item.title}</Text>
                  <Text fontWeight="medium">{item.contents}</Text>
                </MotionBox>
              ))}
            </Stack>
          </MotionBox>
        </GridItem>
        <GridItem
          colSpan={{ base: 3, lg: 2 }}
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <AnimatePresence>
            <MotionBox
              key={items[selected].image}
              viewport={{ amount: 0.6 }}
              initial="hidden"
              whileInView="visible"
              variants={previewVariants}
            >
              <ChakraNextImage src={items[selected].image} height="400" width="700" />
            </MotionBox>
          </AnimatePresence>
        </GridItem>
      </Grid>
    </MainSectionLayout>
  );
}

export default BroadcasterMainHowToUse;
