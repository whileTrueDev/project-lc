import { Flex, Link, Text } from '@chakra-ui/react';
import { useKkshowSubNav } from '@project-lc/hooks';
import NextLink from 'next/link';

export default function KkshowSubNavbar(): JSX.Element {
  const { data: subNavLinks } = useKkshowSubNav();
  return (
    <Flex
      display={{ base: 'none', md: 'flex' }}
      maxW="5xl"
      m="auto"
      minH="60px"
      px={4}
      py={4}
      gap={4}
    >
      {subNavLinks?.map((subNavLink) => (
        <NextLink key={subNavLink.id} href={subNavLink.link} passHref>
          <Link pr={2} href={subNavLink.link}>
            <Text>{subNavLink.name}</Text>
          </Link>
        </NextLink>
      ))}
    </Flex>
  );
}
