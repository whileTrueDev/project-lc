import { Box, Button, Flex, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function MypageFooter(): JSX.Element {
  const router = useRouter();
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
      <SimpleGrid columns={{ base: 2, md: 4 }}>
        <Button
          size="sm"
          fontSize="sm"
          variant="ghost"
          onClick={() =>
            window.open(
              'https://whiletrue.notion.site/FAQ-f182f90b7e984badb031a62ddd1bd00d',
            )
          }
        >
          FAQ
        </Button>
        <Button
          size="sm"
          fontSize="sm"
          variant="ghost"
          onClick={() => router.push('/privacy')}
        >
          개인정보처리방침
        </Button>
        <Button
          size="sm"
          fontSize="sm"
          variant="ghost"
          onClick={() => router.push('/termsOfService')}
        >
          이용약관
        </Button>
      </SimpleGrid>
      <Box mt={{ base: 4, md: 0 }}>
        <Text fontSize="sm">ⓒ 2019 whileTrue All rights reserved.</Text>
      </Box>
    </Flex>
  );
}

export default MypageFooter;
