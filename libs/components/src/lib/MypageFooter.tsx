import {
  Flex,
  useColorModeValue,
  Box,
  Text,
  Stack,
  Link,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';

export function MypageFooter(): JSX.Element {
  return (
    <Flex
      minH="60px"
      as="footer"
      borderTop={1}
      borderStyle="solid"
      color={useColorModeValue('gray.600', 'white')}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      px={4}
      py={2}
      alignItems="center"
      justify="space-between"
      direction={{ base: 'column', md: 'row' }}
      display={{ base: 'none', md: 'flex' }}
    >
      <SimpleGrid direction="row" columns={{ base: 2, md: 4 }}>
        {/* <Button size="sm" fontSize="sm" variant="ghost">
          고객센터
        </Button> */}
        <Button size="sm" fontSize="sm" variant="ghost">
          {/* 문의하기 */}
          <Link href="https://whiletrue.notion.site/FAQ-f182f90b7e984badb031a62ddd1bd00d">
            FAQ
          </Link>
        </Button>
        <Button size="sm" fontSize="sm" variant="ghost">
          <Link
            fontWeight="bold"
            href="https://whiletrue.notion.site/7f6758f5344246c4989ac22f3ee7532e"
          >
            개인정보처리방침
          </Link>
        </Button>
        <Button size="sm" fontSize="sm" variant="ghost">
          <Link href="https://whiletrue.notion.site/41561f284f754560a64f36bc7c292861">
            이용약관
          </Link>
        </Button>
      </SimpleGrid>
      <Box mt={{ base: 4, md: 0 }}>
        <Text fontSize="sm">
          ⓒ {new Date().getFullYear()} whileTrue All rights reserved.
        </Text>
      </Box>
    </Flex>
  );
}

export default MypageFooter;
