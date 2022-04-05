import { Box, Flex, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { kakaoChannel } from '@project-lc/utils-frontend';
import NextLink from 'next/link';

export function KkshowMainPlusFriend(): JSX.Element {
  return (
    <MotionBox
      py={{ base: 12, md: 20 }}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <Box maxW="5xl" m="0 auto">
        <LinkBox>
          <Flex
            p={4}
            color="whiteAlpha.900"
            bgColor="blue.500"
            h={120}
            justify="center"
            align="center"
          >
            <NextLink href={kakaoChannel} passHref>
              <LinkOverlay isExternal>
                <Heading fontSize={{ base: 'md', sm: 'lg', md: '2xl' }}>
                  크크쇼랑 플친 맺고 다양한 혜택과 소식 받아보세요!
                </Heading>
              </LinkOverlay>
            </NextLink>
            <Box
              w={260}
              h={120}
              backgroundImage="url(images/main/mockup.png)"
              backgroundSize="contain"
              backgroundRepeat="no-repeat"
              backgroundPosition="bottom right"
            />
          </Flex>
        </LinkBox>
      </Box>
    </MotionBox>
  );
}

export default KkshowMainPlusFriend;
