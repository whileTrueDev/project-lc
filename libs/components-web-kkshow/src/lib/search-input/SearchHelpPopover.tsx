import { SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
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
      zIndex="docked"
      rounded="md"
      boxShadow="md"
    >
      <SearchRecentKeywords onItemClick={onItemClick} />
    </Box>
  );
}

export function SearchRecentKeywords({
  onItemClick,
}: SearchHelpPopoverProps): JSX.Element {
  const hoverColor = useColorModeValue('gray.50', 'gray.700');
  const { keywords, setKeywords, loadKeywords } = useKkshowSearchStore();

  useEffect(() => {
    loadKeywords();
  }, [loadKeywords]);

  const deleteLocalStorageSearchKeyword = (toDeleteKeyword: string): void => {
    const localDataArray: string[] = JSON.parse(
      window.localStorage.getItem('searchKeyword') || '[]',
    );
    const index = localDataArray.indexOf(toDeleteKeyword);
    if (index !== -1) {
      localDataArray.splice(index, 1);
      window.localStorage.setItem('searchKeyword', JSON.stringify(localDataArray));
      setKeywords(JSON.parse(window.localStorage.getItem('searchKeyword') || '[]'));
    }
  };

  return (
    <Box
      p={{ base: 2, md: 0 }}
      my={3}
      bgColor={useColorModeValue('white', 'gray.600')}
      color={useColorModeValue('black', 'white')}
    >
      <Text
        ml={2}
        as="sup"
        fontSize={{ base: 'md', md: 'xs' }}
        fontWeight={{ base: 'bold', md: 'unset' }}
        color={useColorModeValue('blue.400', 'gray.400')}
      >
        최근 검색어
      </Text>
      {keywords.length === 0 && <Text ml={3}>최근 검색어가 없습니다</Text>}
      {keywords.map((item: string) => (
        <Flex
          key={item}
          _hover={{ backgroundColor: hoverColor }}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={{ base: 'thin', md: 0 }}
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
            onClick={() => deleteLocalStorageSearchKeyword(item)}
          />
        </Flex>
      ))}
    </Box>
  );
}

export default SearchHelpPopover;
