import { Box, Button, Flex, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { useDisplaySize, useIsLoggedIn } from '@project-lc/hooks';
import { useRouter } from 'next/router';

function MainBetaVideo(): React.ReactElement {
  return (
    <Box
      w={{ base: '100%', md: '89.9%' }}
      position="relative"
      padding={{ base: '56.3% 0 0 0', md: '50.625% 0 0 0' }}
    >
      <iframe
        src="https://www.youtube.com/embed/4pIuCJTMXQU?controls=0&autoplay=1"
        title="project-lc-main-video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}

function MainBetaStartButton(): React.ReactElement {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();
  return (
    <Button
      onClick={() => {
        if (isLoggedIn) return router.push('/mypage');
        return router.push('/login');
      }}
      fontWeight={600}
      color="white"
      size="lg"
      fontSize="md"
      bg="pink.400"
      _hover={{
        bg: 'pink.300',
      }}
    >
      시작하기
    </Button>
  );
}
/** 판매자 메인화면 (베타버전, 데스크탑화면) */
export function SellerMainBetaDesktop(): React.ReactElement {
  const { isMobileSize } = useDisplaySize();

  return (
    <SimpleGrid minH="92vh" columns={2} alignItems="center" px={2}>
      <Stack justify="center" alignItems="center">
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>팬들과 함께 소통하는 쇼핑</Heading>
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>그래서, 더욱 믿을 수 있는</Heading>
        <Flex w="100%" pt={4} alignItems="center" justify="center">
          <MainBetaStartButton />
        </Flex>
      </Stack>
      {!isMobileSize && <MainBetaVideo />}
    </SimpleGrid>
  );
}

/** 판매자 메인화면 (베타버전, 모바일화면) */
export function SellerMainBetaMobile(): React.ReactElement {
  return (
    <Stack>
      <Stack minH="92vh">
        <MainBetaVideo />

        <Stack minH="50vh" justify="center" alignItems="center">
          <Stack alignItems="center">
            <Heading size="lg">팬들과 함께 소통하는 쇼핑</Heading>
            <Heading size="lg">그래서, 더욱 믿을 수 있는</Heading>
            <Flex w="100%" pt={4} alignItems="center" justify="center">
              <MainBetaStartButton />
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

/** 방송인 메인화면 (베타버전, 데스크탑화면) */
export function BroadcasterMainBetaDesktop(): React.ReactElement {
  const { isMobileSize } = useDisplaySize();

  return (
    <SimpleGrid minH="92vh" columns={2} alignItems="center" px={2}>
      <Stack justify="center" alignItems="center">
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>팬들과 함께 소통하는 쇼핑</Heading>
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>그래서, 더욱 믿을 수 있는</Heading>
        <Flex w="100%" pt={4} alignItems="center" justify="center">
          <MainBetaStartButton />
        </Flex>
      </Stack>
      {!isMobileSize && <MainBetaVideo />}
    </SimpleGrid>
  );
}

/** 방송인 메인화면 (베타버전, 모바일화면) */
export function BroadcasterMainBetaMobile(): React.ReactElement {
  return (
    <Stack>
      <Stack minH="92vh">
        <MainBetaVideo />

        <Stack minH="50vh" justify="center" alignItems="center">
          <Stack alignItems="center">
            <Heading size="lg">팬들과 함께 소통하는 쇼핑</Heading>
            <Heading size="lg">그래서, 더욱 믿을 수 있는</Heading>
            <Flex w="100%" pt={4} alignItems="center" justify="center">
              <MainBetaStartButton />
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
