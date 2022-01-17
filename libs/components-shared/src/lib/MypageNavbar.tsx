import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MypageLink } from '@project-lc/components-constants/navigation';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export interface MypageNavbarProps {
  navLinks: Array<MypageLink>;
}
export function MypageNavbar({ navLinks }: MypageNavbarProps): JSX.Element {
  const router = useRouter();
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const subNavHoverColor = useColorModeValue('pink.50', 'gray.900');

  // * 현재 페이지에 매치하는지 확인 함수
  const isMatched = useCallback(
    (link: MypageLink) => {
      return link.checkIsActive(router.pathname, link.href);
    },
    [router.pathname],
  );

  return (
    <Stack as="nav" direction="column" height="100%" w="100%">
      <Accordion allowMultiple allowToggle>
        {navLinks.map((link) => (
          <AccordionItem key={link.name}>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                <NextLink
                  href={link.children ? link.children[0].href : link.href}
                  passHref
                >
                  <Link
                    py={2}
                    w="100%"
                    display="inline-block"
                    mx={{ base: 1, sm: 3 }}
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight={isMatched(link) ? 'bold' : 500}
                    textDecoration={isMatched(link) ? 'underline' : 'none'}
                    textDecorationColor={isMatched(link) ? 'red.400' : 'none'}
                    textDecorationThickness={isMatched(link) ? '0.225rem' : 'none'}
                    _hover={{ color: linkHoverColor }}
                  >
                    {link.name}
                  </Link>
                </NextLink>
              </Box>
              {link.children && <AccordionIcon />}
            </AccordionButton>
            {link.children && (
              <AccordionPanel pb={4}>
                {link.children.map((child) => (
                  <NextLink key={child.name} href={child.href ?? '#'} passHref>
                    <Link
                      role="group"
                      display="block"
                      p={2}
                      rounded="md"
                      _hover={{ bg: subNavHoverColor }}
                    >
                      <Stack direction="row" align="center">
                        <Box>
                          <Text
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            fontWeight={500}
                            transition="all .3s ease"
                            _groupHover={{ color: 'pink.400' }}
                          >
                            {child.name}
                          </Text>
                        </Box>
                      </Stack>
                    </Link>
                  </NextLink>
                ))}
              </AccordionPanel>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
}

export default MypageNavbar;
