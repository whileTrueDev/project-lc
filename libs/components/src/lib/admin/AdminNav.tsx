import { Box, Link, Flex, useColorModeValue, Button, Stack } from '@chakra-ui/react';
import { useIsLoggedIn, useLogout } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export default function AdminNav(): JSX.Element {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();
  const { logout } = useLogout();

  function adminLogout(): void {
    logout();
    router.push('/');
  }

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
          <Box key="정산정보관리">
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
                정산정보관리
              </Link>
            </NextLink>
          </Box>
          <Box key="상품검수">
            <NextLink href={'/goods' ?? '#'} passHref>
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
                상품검수
              </Link>
            </NextLink>
          </Box>
          <Box key="공지사항">
            <NextLink href={'/notice' ?? '#'} passHref>
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
                공지사항
              </Link>
            </NextLink>
          </Box>
          <Box key="라이브쇼핑관리">
            <NextLink href={'/live-shopping' ?? '#'} passHref>  
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
                라이브 쇼핑 관리
             </Link>
            </NextLink>
          </Box>      
        </Flex>
        <>
          {isLoggedIn && (
            <>
              <Button my={1} size="sm" onClick={adminLogout}>
                로그아웃
              </Button>
            </>
          )}
        </>
      </Flex>
    </Box>
  );
}
