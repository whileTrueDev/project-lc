import { ChevronRightIcon, Icon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { MypageLink } from '@project-lc/components-constants/navigation';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

export interface MypageSidebarPrpps {
  navLinks: Array<MypageLink>;
  isFolded?: boolean;
}
export function MypageSidebar({ navLinks, isFolded }: MypageSidebarPrpps): JSX.Element {
  const realNavLinks = navLinks.filter((l) => !l.isInvisible);
  const router = useRouter();

  // * 현재 페이지에 매치하는지 확인 함수
  const isMatched = useCallback(
    (link: MypageLink) => link.checkIsActive(router.pathname, link.href),
    [router.pathname],
  );

  // * 현재 페이지에 매치하는 link의 인덱스(해당 accordion item open하기 위함)
  const matchedLinkIndex = useMemo(() => {
    const index = realNavLinks.findIndex((link) => isMatched(link));
    return index;
  }, [isMatched, realNavLinks]);

  if (isFolded) {
    return (
      <Box as="nav">
        {realNavLinks.map((link) => (
          <FoldedSidebarItem key={link.name} link={link} isMatched={isMatched(link)} />
        ))}
      </Box>
    );
  }

  return (
    <Accordion as="nav" allowMultiple allowToggle defaultIndex={[matchedLinkIndex]}>
      {realNavLinks.map((link) => (
        <SidebarItem key={link.name} link={link} isMatched={isMatched(link)} />
      ))}
    </Accordion>
  );
}

interface SidebarItemProps {
  link: MypageLink;
  isMatched?: boolean;
}

function FoldedSidebarItem({ link, isMatched }: SidebarItemProps): JSX.Element {
  const router = useRouter();
  const hoverColor = useColorModeValue('blue.400', 'blue.600');
  return (
    <Popover placement="right-start" trigger="click">
      <PopoverTrigger>
        <Flex justify="center" alignItems="center">
          <Tooltip placement="right" label={link.name}>
            <Button
              position="relative"
              variant="unstyled"
              display="flex"
              alignItems="center"
              py={4}
              px={4}
              _hover={{ bg: hoverColor, color: 'whiteAlpha.900' }}
              bg={!link.children && isMatched ? 'blue.500' : 'none'}
              color={!link.children && isMatched ? 'white' : 'inherit'}
              fontWeight={!link.children && isMatched ? 'bold' : 'medium'}
              onClick={() => {
                if (!link.children) router.push(link.href);
              }}
            >
              {link.icon && <Icon as={link.icon} width={5} height={5} />}
              {link.children && (
                <ChevronRightIcon position="absolute" right={-1} top="11px" />
              )}
            </Button>
          </Tooltip>
        </Flex>
      </PopoverTrigger>

      {link.children && link.children.length > 0 && (
        <Portal>
          <PopoverContent border={0} boxShadow="xl" rounded="lg" maxW="200px">
            {link.children.map((child) => (
              <SidebarChildItem
                key={child.name}
                link={child}
                hoverColor={hoverColor}
                leftSpacing={false}
              />
            ))}
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
}

export function SidebarItem({ link, isMatched }: SidebarItemProps): JSX.Element {
  const router = useRouter();
  const hoverColor = useColorModeValue('blue.400', 'blue.600');

  return (
    <AccordionItem key={link.name} border="none" px={1}>
      <AccordionButton
        py={3}
        textAlign="left"
        borderRadius="md"
        bg={!link.children && isMatched ? 'blue.500' : 'none'}
        color={!link.children && isMatched ? 'white' : 'inherit'}
        fontWeight={!link.children && isMatched ? 'bold' : 'medium'}
        fontSize={{ base: 'lg', sm: 'sm' }}
        _hover={{ bg: hoverColor, color: 'whiteAlpha.900' }}
        justifyContent="space-between"
        alignItems="center"
        onClick={() => {
          if (!link.children) router.push(link.href);
        }}
      >
        <Flex alignItems="center" gap={2}>
          {link.icon && <Icon as={link.icon} width={5} height={5} />}
          <Text>{link.name}</Text>
        </Flex>
        {link.children && <AccordionIcon />}
      </AccordionButton>

      {link.children && (
        <AccordionPanel p={0} mt={1}>
          {link.children.map((child) => (
            <SidebarChildItem key={child.name} link={child} hoverColor={hoverColor} />
          ))}
        </AccordionPanel>
      )}
    </AccordionItem>
  );
}

interface SidebarChildItemProps {
  link: Omit<SidebarItemProps['link'], 'icon'>;
  hoverColor: string;
  leftSpacing?: boolean;
}
function SidebarChildItem({
  link,
  hoverColor,
  leftSpacing = true,
}: SidebarChildItemProps): JSX.Element {
  const router = useRouter();
  const isMatched = link.checkIsActive(router.pathname, link.href);
  return (
    <NextLink key={link.name} href={link.href ?? '#'} passHref>
      <Link
        display="block"
        role="group"
        rounded="md"
        _hover={{ bg: hoverColor, color: 'whiteAlpha.900' }}
        bg={isMatched ? 'blue.500' : 'none'}
        color={isMatched ? 'white' : 'inherit'}
        fontWeight={isMatched ? 'bold' : 'medium'}
        fontSize={{ base: 'lg', sm: 'sm' }}
        pl={leftSpacing ? '44px' : 2}
        pr={2}
        py={3}
        transition="all .3s ease"
      >
        {link.name}
      </Link>
    </NextLink>
  );
}

export default MypageSidebar;
