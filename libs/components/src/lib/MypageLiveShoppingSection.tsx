import { Box, Center, Flex, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { BroadcasterLiveShoppingList } from './BroadcasterLiveShoppingList';
import { YouCanHorizontalScrollText } from './YouCanHorizontalScrollText';
import TextWithPopperButton from './TextWithPopperButton';

export function MypageLiveShoppingSection(): JSX.Element {
  return (
    <Box borderWidth="1px" borderRadius="md" m={2} height="fit-content">
      <Flex
        ml={5}
        mt={5}
        direction={['column', 'column', 'column', 'row']}
        justifyContent="space-between"
      >
        <TextWithPopperButton
          iconAriaLabel="liveshopping-section-help"
          title={
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              라이브 쇼핑
            </Text>
          }
        >
          <YouCanHorizontalScrollText />
        </TextWithPopperButton>
      </Flex>

      <BroadcasterLiveShoppingList useSmallSize />
      <Center m={3}>
        <NextLink href="/mypage/live" passHref>
          <Link fontSize="sm">더보기{' >'}</Link>
        </NextLink>
      </Center>
    </Box>
  );
}
