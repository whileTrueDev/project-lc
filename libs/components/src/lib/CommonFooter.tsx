import {
  Box,
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const ListHeader = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <Text fontWeight="500" fontSize="lg" mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}): JSX.Element => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded="full"
      w={8}
      h={8}
      cursor="pointer"
      as="a"
      href={href}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export function CommonFooter(): JSX.Element {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align="flex-start">
            <ListHeader>회사</ListHeader>
            <Link href="/">소개</Link>
            <Link href="/">블로그</Link>
            <Link href="/">인재채용</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader>정책</ListHeader>
            <Link href="/">쿠키 정책</Link>
            <Link fontWeight="bold" href="/">
              개인정보처리방침
            </Link>
            <Link href="/">이용약관</Link>
          </Stack>

          <Stack align="flex-start">
            <ListHeader>고객지원</ListHeader>
            <Link href="/">고객센터</Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container
          as={Stack}
          maxW="6xl"
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Text fontSize="sm">
            ⓒ {new Date().getFullYear()} whileTrue All rights reserved.
          </Text>
          <Stack direction="row" spacing={6}>
            <SocialButton label="YouTube" href="/">
              <FaYoutube />
            </SocialButton>
            <SocialButton label="Instagram" href="/">
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
