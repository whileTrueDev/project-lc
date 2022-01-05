import { SearchIcon } from '@chakra-ui/icons';
import {
  CloseButton,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';

export function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export interface QuickSearchInputProps extends InputGroupProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}
export function QuickSearchInput({
  clearSearch,
  onChange,
  value,
  ...inputGroupProps
}: QuickSearchInputProps): JSX.Element {
  return (
    <InputGroup {...inputGroupProps}>
      <Input value={value} onChange={onChange} />
      <InputLeftElement>
        <SearchIcon />
      </InputLeftElement>
      <InputRightElement>
        <CloseButton onClick={clearSearch} />
      </InputRightElement>
    </InputGroup>
  );
}

export default QuickSearchInput;
