import { Flex, Input, IconButton, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRef } from 'react';

export function SearchBox(): JSX.Element {
  const initialRef = useRef<HTMLInputElement>(null);
  return (
    <Flex w="100%">
      <Input
        ref={initialRef}
        variant="outline"
        placeholder="검색어를 입력하세요"
        rounded="md"
        bgColor={useColorModeValue('white', 'gray.600')}
      />
      <IconButton
        variant="fill"
        aria-label="search-button-icon"
        onClick={() => alert('검색')}
        icon={<SearchIcon fontSize="lg" />}
      />
    </Flex>
  );
}

export default SearchBox;
