import { Flex, Input, IconButton, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useSearchResults } from '@project-lc/hooks';
import { useRef, useState } from 'react';

export function SearchBox(): JSX.Element {
  const initialRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState('');

  // const handleSearchResults = useSearchResults(keyword);
  // function handleKeyword(value: string): void {
  //   console.log(value);
  //   setKeyword(value);
  // }

  return (
    <Flex w="100%">
      <Input
        ref={initialRef}
        variant="outline"
        placeholder="검색어를 입력하세요"
        rounded="md"
        bgColor={useColorModeValue('white', 'gray.600')}
        onChange={(e) => handleKeyword(e.target.value)}
      />
      <IconButton
        variant="fill"
        aria-label="search-button-icon"
        onClick={() => console.log(keyword)}
        icon={<SearchIcon fontSize="lg" />}
      />
    </Flex>
  );
}

export default SearchBox;
