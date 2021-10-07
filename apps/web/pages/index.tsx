import { SimpleGrid, Stack, Button, HStack, Box, Flex, Heading } from '@chakra-ui/react';
import { CommonFooter, Navbar } from '@project-lc/components';
import React from 'react-transition-group/node_modules/@types/react';
import { useDisplaySize } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <Navbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <MainBetaMobile /> : <MainBetaDesktop />}
        <CommonFooter />
      </Flex>
    </div>
  );
}

export default Index;

export function MainBetaDesktop(): React.ReactElement {
  const { isMobileSize } = useDisplaySize();
  const router = useRouter();

  return (
    <SimpleGrid minH="92vh" columns={2} alignItems="center">
      <Stack justify="center" alignItems="center">
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>팬들과 함께 소통하는 쇼핑</Heading>
        <Heading fontSize={{ md: '2xl', lg: '4xl' }}>그래서, 더욱 믿을 수 있는</Heading>
        <Flex w="100%" pt={4} alignItems="center" justify="center">
          <Button
            onClick={() => router.push('/login')}
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
        </Flex>
      </Stack>
      {!isMobileSize && (
        <Box w="100%" h={{ md: 400, xl: 630 }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/4pIuCJTMXQU?controls=0&autoplay=1"
            title="project-lc-main-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      )}
    </SimpleGrid>
  );
}

export function MainBetaMobile(): React.ReactElement {
  const router = useRouter();
  return (
    <Stack>
      <Stack minH="92vh">
        <Box>
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/4pIuCJTMXQU?controls=0&autoplay=1"
            title="project-lc-main-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Stack minH="50vh" justify="center" alignItems="center">
          <Stack alignItems="center">
            <Heading size="lg">팬들과 함께 소통하는 쇼핑</Heading>
            <Heading size="lg">그래서, 더욱 믿을 수 있는</Heading>
            <Flex w="100%" pt={4} alignItems="center" justify="center">
              <Button
                onClick={() => router.push('/login')}
                fontWeight={600}
                isFullWidth
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
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
