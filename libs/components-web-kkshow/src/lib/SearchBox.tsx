import {
  Flex,
  Input,
  IconButton,
  useColorModeValue,
  InputRightElement,
  useToast,
  Text,
  Box,
} from '@chakra-ui/react';
import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { useRef, useEffect, useState } from 'react';
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
  const { handlePopover } = useSearchPopoverStore();

  const initialRef = useRef<any>(null);
  const toast = useToast();

  const { keyword } = useKkshowSearchStore();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);
  const router = useRouter();
  const queryClient = useQueryClient();
  const inputPrefix = (router.query.keyword as string) || keyword;
  const { isMobileSize } = useDisplaySize();
  const { handleSubmit, setValue } = useForm<SearchInput>();
  //* 필터/검색 폼 제출
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

  function setSearchKeyword(value: string): void {
    setKeyword(value);
    setValue('keyword', value);
  }

  useEffect(() => {
    if (isMobileSize) {
      initialRef.current.focus();
    }
  }, [isMobileSize]);
  return (
    <Flex w="100%" h="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Input
        defaultValue={inputPrefix}
        ref={initialRef}
        variant="outline"
        placeholder="검색어를 입력하세요"
        rounded="md"
        bgColor={useColorModeValue('white.400', 'gray.600')}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
        }}
        onFocus={() => handlePopover(true)}
        onBlur={() => handlePopover(false)}
      />
      {initialRef?.current?.value && (
        <InputRightElement>
          <IconButton
            display={{ base: 'flex', xl: 'none' }}
            variant="fill"
            aria-label="erase-button-icon"
            icon={<MdCancel color="gray" />}
            onClick={() => {
              initialRef.current.value = '';
              setSearchKeyword('');
            }}
          />
        </InputRightElement>
      )}
      <IconButton
        display={{ base: 'none', xl: 'flex' }}
        variant="fill"
        aria-label="search-button-icon"
        icon={<SearchIcon fontSize="lg" />}
        type="submit"
      />
    </Flex>
  );
}

export default SearchBox;
