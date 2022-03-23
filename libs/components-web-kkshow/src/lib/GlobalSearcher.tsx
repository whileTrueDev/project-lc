import { SearchIcon } from '@chakra-ui/icons';
import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchBox } from './SearchBox';

export function GlobalSearcher(): JSX.Element {
  return (
    <>
      <InputGroup size="sm" xl={240} display={{ base: 'none', xl: 'flex' }}>
        <SearchBox />
      </InputGroup>
    </>
  );
}
export default GlobalSearcher;
