import NextLink from 'next/link';
import {
  Box,
  Container,
  Flex,
  GridItem,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  footerInfoArr,
  FooterLinkListItem,
} from '@project-lc/components-constants/footerLinks';
import { MotionButton } from '@project-lc/components-core/MotionButton';
import { ReactNode } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const ListHeader = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <Text fontWeight="medium" fontSize={{ base: 'md', md: 'lg' }} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href: string;
}): JSX.Element => {
  return (
    <MotionButton
      w={8}
      h={8}
      p={0}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      rounded="full"
      cursor="pointer"
      as="a"
      onClick={() => window.open(href)}
      bg="whiteAlpha.100"
      _hover={{ bg: 'whiteAlpha.100' }}
      _focus={{ bg: 'whiteAlpha.100' }}
      _active={{ bg: 'whiteAlpha.100' }}
      aria-label={`${label}button`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transitionDuration="0.2"
    >
      {icon}
    </MotionButton>
  );
};

export interface CommonFooterProps {
  footerLinkList: FooterLinkListItem[];
}
export function CommonFooter({ footerLinkList }: CommonFooterProps): JSX.Element {
  return (
    <Box bg="blue.900" color="gray.200">
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {footerLinkList.map((linkList) => (
            <Stack key={linkList.title} align="flex-start">
              <ListHeader>{linkList.title}</ListHeader>
              {linkList.items.map((linkItem) => (
                <NextLink key={linkItem.title} href={linkItem.href} passHref>
                  <Link
                    href={linkItem.href}
                    fontWeight={linkItem.isBold ? 'bold' : 'normal'}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    {linkItem.title}
                  </Link>
                </NextLink>
              ))}
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      <Flex borderTopWidth={1} borderStyle="solid" borderColor="gray.700" fontSize="sm">
        <Container as={Stack} maxW="6xl" py={4} pt={8} direction="column" spacing={4}>
          <Stack direction="row" spacing={6}>
            <SocialButton
              icon={<FaYoutube fontSize="20px" />}
              label="YouTube"
              href="https://www.youtube.com/channel/UCN3w7jS8f6t2fPROcRY7e0g"
            />
            <SocialButton
              icon={<FaInstagram fontSize="20px" />}
              label="Instagram"
              href="https://www.instagram.com/zzmarket/"
            />
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={2}>
            {footerInfoArr.map((t) => (
              <GridItem key={t} colSpan={t.includes('사업장소재지') ? 2 : [2, 1]}>
                <Text>{t}</Text>
              </GridItem>
            ))}
          </SimpleGrid>
          <Text>ⓒ 2019 whileTrue All rights reserved.</Text>
        </Container>
      </Flex>
    </Box>
  );
}
