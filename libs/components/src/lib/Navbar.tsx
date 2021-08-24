import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useIsLoggedIn, useLogout, useProfile } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AiTwotoneSetting } from 'react-icons/ai';
import { mainNavItems, NavItem } from '../constants/navigation';
import { ColorModeSwitcher } from './ColorModeSwitcher';

export function Navbar() {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
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
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          alignItems="center"
        >
          <Heading fontSize="md">
            <NextLink href="/" passHref>
              <Link
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                color={useColorModeValue('gray.800', 'white')}
              >
                PROJECT_LC
              </Link>
            </NextLink>
          </Heading>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          alignItems="center"
          direction="row"
          spacing={{ base: 0, sm: 4 }}
        >
          <ColorModeSwitcher />
          {isLoggedIn ? (
            <>
              <Popover>
                <PopoverTrigger>
                  <Avatar as="button" size="sm" cursor="pointer" />
                </PopoverTrigger>
                <PopoverContent maxWidth="80px">
                  <Tooltip label="계정 설정" fontSize="xs">
                    <IconButton
                      size="md"
                      fontSize="xl"
                      variant="ghost"
                      color="current"
                      aria-label="settings icon"
                      icon={<AiTwotoneSetting />}
                      onClick={() => router.push('/mypage/setting')}
                    />
                  </Tooltip>
                  <Button
                    display={{ md: 'inline-flex' }}
                    fontSize="sm"
                    fontWeight={600}
                    color="white"
                    bg="pink.400"
                    _hover={{
                      bg: 'pink.300',
                    }}
                    onClick={logout}
                  >
                    로그아웃
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button
                as="a"
                fontSize="sm"
                fontWeight={500}
                variant="link"
                onClick={() => router.push('/login')}
              >
                로그인
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="pink.400"
                _hover={{
                  bg: 'pink.300',
                }}
              >
                시작하기
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction="row" spacing={4}>
      {mainNavItems.map((navItem) => (
        <Box key={navItem.label}>
          <NextLink href={navItem.href ?? '#'} passHref>
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
              {navItem.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {mainNavItems.map((navItem) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href, needLogin }: NavItem) => {
  const navItemTextColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Flex
      py={1}
      justify="space-between"
      align="center"
      _hover={{ textDecoration: 'none' }}
    >
      <NextLink href={href ?? '#'} passHref>
        <Link fontSize="sm" fontWeight={500} color={navItemTextColor}>
          {label}
        </Link>
      </NextLink>
    </Flex>
  );
};
