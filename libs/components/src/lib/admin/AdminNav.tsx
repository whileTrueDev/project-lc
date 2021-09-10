import { Box, Link, Flex, useColorModeValue, Button, Stack } from '@chakra-ui/react';
import { useIsLoggedIn, useLogout } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export default function AdminNav(): JSX.Element {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const { isLoggedIn } = useIsLoggedIn();
  const { logout } = useLogout();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
        justify="space-between"
      >
        <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
          <Box key="관리자">
            <NextLink href={'/admin' ?? '#'} passHref>
              <Link
                p={2}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                관리자
              </Link>
            </NextLink>
          </Box>
        </Flex>
        <>
          {isLoggedIn && (
            <>
              <Button my={1} size="xs" onClick={logout}>
                기존 계정 로그아웃
              </Button>
            </>
          )}
        </>
      </Flex>
    </Box>
  );
}
