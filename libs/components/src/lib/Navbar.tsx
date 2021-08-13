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
  Stack,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AiTwotoneSetting } from 'react-icons/ai';
import { mainNavItems, NavItem } from '../constants';
import { ColorModeSwitcher } from './ColorModeSwitcher';

export function Navbar() {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();

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
          spacing={{ base: 1, sm: 4 }}
        >
          <ColorModeSwitcher />
          <Button as="a" fontSize="sm" fontWeight={500} variant="link" href="#">
            Sign In
          </Button>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="pink.400"
            href="#"
            _hover={{ bg: 'pink.300' }}
          >
            Sign Up
          </Button>
          {/* 로그인 된 경우 = 아래 */}
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
          <Avatar size="sm" />
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
