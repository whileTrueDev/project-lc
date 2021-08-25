import {
  Flex,
  useColorModeValue,
  Box,
  Text,
  Stack,
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
        <Button size="sm" fontSize="sm" variant="ghost">
          고객센터
        </Button>
        <Button size="sm" fontSize="sm" variant="ghost">
          문의하기
        </Button>
        <Button size="sm" fontSize="sm" fontWeight="bold" variant="ghost">
          개인정보 처리방침
        </Button>
        <Button size="sm" fontSize="sm" variant="ghost">
          이용약관
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
