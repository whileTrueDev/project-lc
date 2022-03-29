import {
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverAnchor,
  Text,
  Flex,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useKkshowSearchStore, useSearchPopoverStore } from '@project-lc/stores';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchBox';

export interface SearchPopoverProps {
  children?: React.ReactNode;
  onSubmit: SubmitHandler<SearchInput>;
}
export function SearchPopover({ children, onSubmit }: SearchPopoverProps): JSX.Element {
  const { isOpen, handlePopover } = useSearchPopoverStore();
  const [localStorage, setLocalStorage] = useState([]);
  const { handleSubmit, setValue } = useForm<SearchInput>();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);

  function setSearchKeyword(value: string): void {
    setKeyword(value);
    setValue('keyword', value);
    onSubmit({ keyword: value });
  }

  useEffect(() => {
    setLocalStorage(JSON.parse(window.localStorage.getItem('searchKeyword') || '[]'));
  }, []);

  return (
    <>
      <Popover isOpen={isOpen} onClose={() => handlePopover(false)} closeOnBlur>
        <PopoverAnchor>{children}</PopoverAnchor>
        <PopoverContent insetY="4vh">
          <PopoverBody color={useColorModeValue('black', 'white')}>
            {localStorage?.map((item: string) => (
              <Flex key={item} justifyContent="space-between" alignItems="center">
                <Text onClick={() => setSearchKeyword(item)} cursor="pointer">
                  {item}
                </Text>
                <IconButton
                  m={1}
                  variant="fill"
                  aria-label="search-button-icon"
                  icon={<SmallCloseIcon />}
                  color="gray"
                />
              </Flex>
            ))}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default SearchPopover;
