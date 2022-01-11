import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { broadcasterFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { FloatingHelpButton } from '@project-lc/components-shared/FloatingHelpButton';
import { KkshowTogether } from '@project-lc/components-shared/KkshowTogether';
import { BroadcasterNavbar } from '@project-lc/components-shared/Navbar';
import { BroadcasterMainHowToUse } from '@project-lc/components-web-bc/main/BroadcasterMainHowToUse';
import { BroadcasterMainIntroduce } from '@project-lc/components-web-bc/main/BroadcasterMainIntroduce';
import { BroadcasterMainProcess } from '@project-lc/components-web-bc/main/BroadcasterMainProcess';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence } from 'framer-motion';

dayjs.extend(relativeTime);

export function Index(): JSX.Element {
  return (
    <div>
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <BroadcasterNavbar />

        <BroadcasterMain />

        <KkshowTogether />

        <CommonFooter footerLinkList={broadcasterFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </div>
  );
}

export default Index;

function BroadcasterMain(): JSX.Element {
  return (
    <Box>
      <BroadcasterMainHero />
      <BroadcasterMainIntroduce />
      <BroadcasterMainProcess />
      <BroadcasterMainHowToUse />
    </Box>
  );
}

function BroadcasterMainHero(): JSX.Element {
  return (
    <Box h={900} bgGradient="linear(to-b, blue.400, blue.500)">
      <Stack color="white" alignItems="center" pt={28}>
        <Heading>방송인 센터</Heading>
        <Box textAlign="center" fontWeight="bold">
          <Text>간단한 설정으로 라이브 쇼핑 진행 및 수익 정산까지 가능합니다.</Text>
          <Text>팬들과 소통하며 상품을 판매하고 추억과 수익을 쌓아보세요!</Text>
        </Box>
      </Stack>
      <Box overflow="hidden" maxW={1920} margin="auto" position="relative">
        <Flex justify="center">
          <Box
            zIndex="docked"
            mt={10}
            backgroundColor="white"
            borderRadius="xl"
            shadow="dark-lg"
            color="WindowText"
            w={600}
            h={400}
            p={2}
          >
            갤러리3
          </Box>
        </Flex>

        <AnimatePresence>
          <MotionBox
            top={0}
            mt={20}
            gap={8}
            position="absolute"
            display="inline-flex"
            alignItems="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box zIndex="base" bgColor="white" w={400} h={300} borderRadius="xl" p={2}>
              갤러리1
            </Box>
            <Box zIndex="base" bgColor="white" w={400} h={300} borderRadius="xl" p={2}>
              갤러리2
            </Box>
            <Box
              ml={40}
              zIndex="base"
              backgroundColor="white"
              color="WindowText"
              w={400}
              h={300}
              borderRadius="xl"
              p={2}
            >
              갤러리4
            </Box>
            <Box
              zIndex="base"
              backgroundColor="white"
              color="WindowText"
              w={400}
              h={300}
              borderRadius="xl"
              p={2}
            >
              갤러리5
            </Box>
          </MotionBox>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
