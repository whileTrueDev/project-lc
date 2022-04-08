import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useKkshowSearchStore } from '@project-lc/stores';
import { MouseEvent, useEffect } from 'react';

interface SearchHelpPopoverProps {
  onItemClick: (item: string) => void;
}
export function SearchHelpPopover({ onItemClick }: SearchHelpPopoverProps): JSX.Element {
  const { isSearchPopoverOpen } = useKkshowSearchStore();
  return (
    <Box
      display={{ base: 'none', md: isSearchPopoverOpen ? 'block' : 'none' }}
      position="absolute"
      width="100%"
      height="fit-content"
      insetY={12}
      flex={1}
      bgColor={useColorModeValue('white', 'gray.600')}
      color={useColorModeValue('black', 'white')}
      zIndex="docked"
      rounded="md"
      boxShadow="md"
    >
      <SearchRecentKeywords onItemClick={onItemClick} />
    </Box>
  );
}

interface SearchRecentKeywordsProps extends SearchHelpPopoverProps {
  bgColor?: BoxProps['bgColor'];
}
export function SearchRecentKeywords({
  onItemClick,
  bgColor,
}: SearchRecentKeywordsProps): JSX.Element {
  const hoverColor = useColorModeValue('gray.100', 'gray.700');
  const defaultBgColor = useColorModeValue('white', 'gray.600');
  const { keywords, deleteKeyword, loadKeywords } = useKkshowSearchStore();

  useEffect(() => {
    loadKeywords();
  }, [loadKeywords]);
  return (
    <Box p={{ base: 2, md: 0 }} my={3} bgColor={bgColor || defaultBgColor}>
      <Text
        ml={2}
        as="sup"
        fontSize={{ base: 'sm', md: 'xs' }}
        fontWeight={{ base: 'bold', md: 'unset' }}
        color={useColorModeValue('blue.400', 'gray.400')}
      >
        최근 검색어
      </Text>
      {keywords.length === 0 && <Text ml={3}>최근 검색어가 없습니다</Text>}
      {keywords.map((item: string, idx) => (
        <Flex
          key={item}
          _hover={{ backgroundColor: hoverColor }}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={{ base: idx !== keywords.length - 1 ? 'thin' : 0, md: 0 }}
          py={1}
        >
          <Flex
            width="100%"
            flex={1}
            pl={3}
            textAlign="left"
            wordBreak="break-all"
            as="button"
            type="submit"
            onMouseDown={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            onClick={() => onItemClick(item)}
          >
            <Text fontWeight="medium" noOfLines={{ base: 2, md: 1 }}>
              {item}
            </Text>
          </Flex>
          <IconButton
            m={1}
            color="gray"
            variant="ghost"
            rounded="full"
            size="sm"
            aria-label="search-button-icon"
            icon={<SmallCloseIcon />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => deleteKeyword(item)}
          />
        </Flex>
      ))}
    </Box>
  );
}

export default SearchHelpPopover;
