import { useToast, Text, Flex, IconButton, Box } from '@chakra-ui/react';
import { useKkshowSearchStore, useSearchPopoverStore } from '@project-lc/stores';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { SearchInput } from './SearchBox';

export interface SearchPopoverProps {
  children?: React.ReactNode;
  onSubmit: SubmitHandler<SearchInput>;
}
export function SearchPopper({ ref }: any): JSX.Element {
  const toast = useToast();
  const { isOpen, handlePopover } = useSearchPopoverStore();
  console.log(isOpen);
  const [localStorage, setLocalStorage] = useState([]);
  const { handleSubmit, setValue } = useForm<SearchInput>();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);
  const { keyword } = useKkshowSearchStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialRef = useRef<any>(null);
  function setSearchKeyword(value: string): void {
    setKeyword(value);
    setValue('keyword', value);
  }

  const onSubmit: SubmitHandler<SearchInput> = () => {
    if (keyword) {
      let localDataArray: string[] = JSON.parse(
        window.localStorage.getItem('searchKeyword') || '[]',
      );
      localDataArray.unshift(keyword);
      localDataArray = [...new Set(localDataArray)];

      if (localDataArray.length > 3) {
        localDataArray = localDataArray.splice(0, 3);
      }

      window.localStorage.setItem('searchKeyword', JSON.stringify(localDataArray));
      router.push({ pathname: '/search', query: { keyword } });
      queryClient.invalidateQueries('getSearchResults');
    } else {
      toast({
        title: '검색어를 입력해주세요',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    setLocalStorage(JSON.parse(window.localStorage.getItem('searchKeyword') || '[]'));
  }, []);

  return (
    <Box
      display={isOpen ? 'block' : 'none'}
      position="absolute"
      width="100%"
      insetY="4vh"
      bg="white"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      zIndex="docked"
    >
      {localStorage?.map((item: string) => (
        <Flex key={item} justifyContent="space-between" alignItems="center">
          <Text
            ref={initialRef}
            as="button"
            onClick={() => setSearchKeyword(item)}
            type="submit"
            cursor="pointer"
          >
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
    </Box>
  );
}

export default SearchPopper;
