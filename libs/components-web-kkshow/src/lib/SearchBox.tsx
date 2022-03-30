import {
  Flex,
  Input,
  IconButton,
  useColorModeValue,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRef, useEffect } from 'react';
import { useKkshowSearchStore, useSearchPopoverStore } from '@project-lc/stores';
import { useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useDisplaySize } from '@project-lc/hooks';
import { MdCancel } from 'react-icons/md';

export interface SearchInput {
  keyword: string;
}

export function SearchBox(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isMobileSize } = useDisplaySize();

  const initialRef = useRef<any>(null);

  const { isOpen, handlePopover } = useSearchPopoverStore();
  const { keyword } = useKkshowSearchStore();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);

  const { handleSubmit } = useForm<SearchInput>();
  //* 필터/검색 폼 제출
  const onSubmit: SubmitHandler<SearchInput> = (): void => {
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
      handlePopover(false);
    } else {
      toast({
        title: '검색어를 입력해주세요',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    setKeyword((router.query.keyword as string) || '');
    if (isMobileSize) {
      initialRef.current.focus();
    }
  }, [isMobileSize, router.query.keyword, setKeyword]);

  return (
    <Flex w="100%" h="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Input
        value={keyword}
        ref={initialRef}
        variant="outline"
        placeholder="검색어를 입력하세요"
        rounded="md"
        bgColor={useColorModeValue('white', 'gray.600')}
        color={useColorModeValue('black', 'white')}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        onMouseDown={() => handlePopover(!isOpen)}
        onBlur={() => handlePopover(false)}
      />
      {isMobileSize && initialRef?.current?.value && (
        <InputRightElement>
          <IconButton
            variant="fill"
            aria-label="erase-button-icon"
            icon={<MdCancel color="gray" />}
            onClick={() => {
              initialRef.current.value = '';
              setKeyword('');
            }}
          />
        </InputRightElement>
      )}
      <IconButton
        display={{ base: 'none', xl: 'flex' }}
        variant="fill"
        aria-label="search-button-icon"
        icon={<SearchIcon />}
        type="submit"
      />
    </Flex>
  );
}

export default SearchBox;
