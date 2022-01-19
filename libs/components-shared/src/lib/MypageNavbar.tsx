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
import { useCallback, useMemo } from 'react';

export interface MypageNavbarProps {
  navLinks: Array<MypageLink>;
}
export function MypageNavbar({ navLinks }: MypageNavbarProps): JSX.Element {
  const router = useRouter();
  const subNavHoverColor = useColorModeValue('blue.50', 'gray.900');

  // * 현재 페이지에 매치하는지 확인 함수
  const isMatched = useCallback(
    (link: MypageLink) => link.checkIsActive(router.pathname, link.href),
    [router.pathname],
  );

  // * 현재 페이지에 매치하는 link의 인덱스(해당 accordion item open하기 위함)
  const matchedLinkIndex = useMemo(() => {
    const index = navLinks.findIndex((link) => isMatched(link));
    return index;
  }, [isMatched, navLinks]);

  return (
    <Stack as="nav" direction="column" height="100%" w="100%">
      <Accordion allowMultiple allowToggle defaultIndex={[matchedLinkIndex]}>
        {navLinks.map((link) => {
          return (
            <AccordionItem key={link.name} border="none">
              <AccordionButton
                p={0}
                textAlign="left"
                borderRightRadius="lg"
                bg={isMatched(link) ? 'blue.500' : 'none'}
                color={isMatched(link) ? 'white' : 'inherit'}
                fontSize={{ base: 'lg', sm: 'md' }}
                fontWeight={isMatched(link) ? 'bold' : 500}
                justifyContent="space-between"
                _hover={{ bg: 'blue.600', color: 'white' }}
              >
                {link.children ? (
                  <>
                    <Text w="100%" p={4}>
                      {link.name}
                    </Text>
                    <AccordionIcon />
                  </>
                ) : (
                  <NextLink href={link.href} passHref>
                    <Link _hover={{ textDecoration: 'none' }} w="100%" p={4}>
                      {link.name}
                    </Link>
                  </NextLink>
                )}
              </AccordionButton>
              {link.children && (
                <AccordionPanel p={1}>
                  {link.children.map((child) => {
                    return (
                      <NextLink key={child.name} href={child.href ?? '#'} passHref>
                        <Link
                          display="block"
                          role="group"
                          rounded="md"
                          _hover={{ bg: subNavHoverColor }}
                          _groupHover={{ color: 'blue.400' }}
                          pl={8}
                          py={2}
                          transition="all .3s ease"
                          fontSize="md"
                          textDecoration={isMatched(child) ? 'underline' : 'none'}
                          textDecorationThickness={isMatched(child) ? '0.2em' : 'none'}
                        >
                          {child.name}
                        </Link>
                      </NextLink>
                    );
                  })}
                </AccordionPanel>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </Stack>
  );
}

export default MypageNavbar;
