import { InputGroup } from '@chakra-ui/react';
import { SearchPopover } from './SearchPopover';
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
        <SearchPopover />
      </InputGroup>
    </>
  );
}
export default GlobalSearcher;
