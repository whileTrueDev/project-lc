import { InputGroup } from '@chakra-ui/react';
import { useRef } from 'react';
import { SearchPopper } from './SearchPopper';
import { SearchBox } from './SearchBox';

export function GlobalSearcher(): JSX.Element {
  return (
    <>
      <InputGroup
        direction="column"
        size="sm"
        xl={240}
        display={{ base: 'none', xl: 'flex' }}
      >
        <SearchBox />
        <SearchPopper />
      </InputGroup>
    </>
  );
}
export default GlobalSearcher;
