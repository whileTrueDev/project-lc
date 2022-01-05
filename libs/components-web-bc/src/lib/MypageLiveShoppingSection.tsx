import { InfoIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Link, Text } from '@chakra-ui/react';
import TextWithPopperButton from '@project-lc/components-core/TextWithPopperButton';
import { YouCanHorizontalScrollText } from '@project-lc/components-shared/YouCanHorizontalScrollText';
import NextLink from 'next/link';
import { BroadcasterLiveShoppingList } from './BroadcasterLiveShoppingList';

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
          icon={<InfoIcon />}
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
