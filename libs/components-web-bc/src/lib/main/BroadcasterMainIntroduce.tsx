import { Box, Flex, Heading, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';

export function BroadcasterMainIntroduce(): JSX.Element {
  return (
    <MainSectionLayout
      _title={{
        pc: `평소 방송하던 곳에서\n라이브 쇼핑을 진행해 보세요.`,
        mobile: `평소 방송하던 곳에서\n라이브 쇼핑을\n진행해 보세요.`,
      }}
    >
      <BroadcasterMainLayout
        title="간단한 방송 설정"
        subtitle={
          '평소 사용하던 송출 프로그램에\n크크쇼에서 발급되는 URL을 넣기만 하면\n라이브쇼핑 진행에 필요한 레이아웃이 자동으로 송출됩니다.'
        }
        image={<BroadcasterMainIntroduceImage />}
        grayBackground
      />

      <BroadcasterMainLayout
        title="팬들의 선물"
        subtitle={
          '시청자가 구매한 상품 금액의 일정 부분이 수익금으로 정산됩니다.\n물론 팬들이 보내는 응원메시지와 선물은 덤이구요.'
        }
        image={<BroadcasterMainGiftImage />}
        reverse
      />

      <BroadcasterMainLayout
        title="새로운 컨텐츠"
        subtitle={
          '평소 진행하던 방송에서 먹방을 진행할 수 있습니다.\n팬분들과 소통하며 상품도 판매하고, 새로운 경험을 해보세요!'
        }
        image={<BroadcasterMainContentsImage />}
        grayBackground
      />
    </MainSectionLayout>
  );
}
export default BroadcasterMainIntroduce;

interface BroadcasterMainLayoutProps {
  title: string;
  subtitle: string;
  image: JSX.Element;
  grayBackground?: boolean;
  reverse?: boolean;
}
function BroadcasterMainLayout({
  title,
  subtitle,
  image,
  grayBackground = false,
  reverse = false,
}: BroadcasterMainLayoutProps): JSX.Element {
  const grayBgColor = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box
      bgColor={grayBackground ? grayBgColor : 'unset'}
      textAlign={reverse ? 'right' : 'unset'}
      overflow={{ base: 'hidden visible', xl: 'hidden hidden' }}
    >
      <Flex
        maxW="6xl"
        minH={500}
        p={4}
        gap={4}
        mx="auto"
        alignItems="center"
        flexDir={{ base: 'column', xl: reverse ? 'row-reverse' : 'row' }}
        textAlign={{ base: 'center', xl: 'inherit' }}
        justify={{ base: 'center', xl: 'space-between' }}
      >
        <Box flex={1} mt={{ base: 24, xl: 0 }}>
          <Heading color="blue.400" fontSize="4xl" fontWeight={600}>
            {title}
          </Heading>
          <Box fontWeight="medium">
            <Text whiteSpace="break-spaces">{subtitle}</Text>
          </Box>
        </Box>
        <Box flex={1} mb={{ base: 12, xl: 0 }}>
          {image}
        </Box>
      </Flex>
    </Box>
  );
}

function BroadcasterMainIntroduceImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.4 } },
  };
  const itemXVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };
  const itemYVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  return (
    <MotionBox
      viewport={{ once: true, amount: 0.5 }}
      position="relative"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      minH={{ base: '300px', xl: 'unset' }}
    >
      {/* 노란 배경 */}
      <MotionBox
        key="yellow"
        position="absolute"
        top={{ base: -130, xl: -50 }}
        right={{ base: -330, xl: -200 }}
        viewport={{ amount: 0.2 }}
        variants={itemXVariants}
      >
        <Image
          src="/images/main/effect-1.png"
          width={{ base: 500, sm: 600 }}
          height={{ base: 330, sm: 400 }}
        />
      </MotionBox>

      {/* 폰 */}
      <MotionBox key="phone" viewport={{ amount: 0.5 }} variants={itemYVariants}>
        <ChakraNextImage src="/images/main/phone-1.png" width="420" height="210" />
      </MotionBox>

      {/* 라이브쇼핑화면URL */}
      <MotionBox
        key="liveshopping-url"
        position="absolute"
        top={{ base: '30px', sm: 50 }}
        right={{ base: 0, xl: 110 }}
        viewport={{ amount: 0.5 }}
        variants={itemYVariants}
      >
        <ChakraNextImage
          src="/images/main/liveshopping-url-1.png"
          width="320"
          height="45"
        />
      </MotionBox>
      {/* URL복사 */}

      <MotionBox
        key="liveshopping-url-copy"
        position="absolute"
        top={{ base: '70px', sm: 90 }}
        right={{ base: 0, xl: 110 }}
        viewport={{ amount: 0.5 }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/url-copy-1.png" width="90" height="42" />
      </MotionBox>
    </MotionBox>
  );
}

function BroadcasterMainGiftImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.4 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const giftVariants = {
    hidden: { opacity: 0, x: -50, y: -20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.2 } },
  };
  return (
    <MotionBox
      viewport={{ once: true, amount: 0.5 }}
      position="relative"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      minH={{ base: '350px', xl: 'unset' }}
    >
      {/* small circle */}
      <MotionBox
        top={{ base: -30, xl: -200 }}
        left={{ base: -300, xl: -170 }}
        width={{ base: 130, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/ellipse-1.png" width="155" height="155" />
      </MotionBox>
      {/* big circle */}
      <MotionBox
        top={{ base: 0, xl: -200 }}
        left={{ base: -175, xl: 0 }}
        width={{ base: 320, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/ellipse-2.png" width="380" height="380" />
      </MotionBox>

      {/* phone */}
      <MotionBox
        top={{ base: 100, xl: -75 }}
        left={{ base: -100, xl: 75 }}
        width={{ base: 400, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/phone-2.png" width="480" height="300" />
      </MotionBox>

      {/* giftbox */}
      <MotionBox
        top={{ base: 100, xl: -85 }}
        left={{ base: 0, xl: 200 }}
        width={{ base: 160, xl: 'unset' }}
        position="absolute"
        variants={giftVariants}
      >
        <ChakraNextImage src="/images/main/gift.png" width="200" height="200" />
      </MotionBox>
    </MotionBox>
  );
}

function BroadcasterMainContentsImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
  };
  const itemYVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const itemXVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1 } },
  };
  const itemXRotateVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0, rotate: 360, transition: { duration: 0.5, delay: 1 } },
  };
  return (
    <MotionBox
      viewport={{ once: true, amount: 0.5 }}
      position="relative"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      minH={{ base: '300px', xl: 'unset' }}
    >
      <MotionBox
        position="absolute"
        top={{ base: 90, xl: -30 }}
        right={{ base: -240, xl: 0 }}
        width={{ base: 150, xl: 'unset' }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/intro3_img3.png" width="200" height="200" />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 0, xl: -180 }}
        right={{ base: -150, xl: 100 }}
        width={{ base: 300, xl: 'unset' }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/intro3_img2.png" width="400" height="400" />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 200, xl: 85 }}
        left={{ base: -380, xl: -250 }}
        width={{ base: 320, xl: 'unset' }}
        variants={itemXVariants}
      >
        <ChakraNextImage
          src="/images/main/intro3_yellow-grad.png"
          width="450"
          height="100"
        />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 185, xl: 70 }}
        left={{ base: -130, xl: 130 }}
        width={{ base: '100px', xl: 'unset' }}
        variants={itemXRotateVariants}
      >
        <ChakraNextImage src="/images/main/intro3_coin.png" width="120" height="120" />
      </MotionBox>
    </MotionBox>
  );
}
