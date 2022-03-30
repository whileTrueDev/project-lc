import { InputGroup } from '@chakra-ui/react';
import { CustomSearchPopover } from './CustomSearchPopover';
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
        <CustomSearchPopover />
      </InputGroup>
    </>
  );
}
export default GlobalSearcher;
