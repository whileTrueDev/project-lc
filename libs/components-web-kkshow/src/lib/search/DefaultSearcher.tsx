import { InputGroup } from '@chakra-ui/react';
import { SearchPopover } from './SearchPopover';
import { SearchBox } from './SearchBox';

export function DefaultSearcher(): JSX.Element {
  return (
    <>
      <InputGroup
        direction="column"
        size="sm"
        xl={240}
        display={{ base: 'none', md: 'flex' }}
      >
        <SearchBox />
        <SearchPopover />
      </InputGroup>
    </>
  );
}
export default DefaultSearcher;
