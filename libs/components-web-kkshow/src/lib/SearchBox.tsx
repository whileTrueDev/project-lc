import { Flex, Input, IconButton, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import { useKkshowSearchStore } from '@project-lc/stores';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

export function SearchBox(): JSX.Element {
  const initialRef = useRef<HTMLInputElement>(null);
  const { keyword } = useKkshowSearchStore();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);
  const router = useRouter();

  const inputPrefix = (router.query.keyword as string) || '';

  const { handleSubmit, control, register, watch, setValue, getValues } = useForm<any>();
  // * 필터/검색 폼 제출
  const onSubmit: SubmitHandler<any> = (data) => {
    router.push(`/search?keyword=${getValues('keyword')}`);
  };

  return (
    <Flex w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Input
        defaultValue={inputPrefix}
        ref={initialRef}
        variant="outline"
        placeholder="검색어를 입력하세요"
        rounded="md"
        bgColor={useColorModeValue('blue.400', 'gray.600')}
        onChange={(e) => {
          setValue('keyword', e.target.value);
          setKeyword(e.target.value);
        }}
      />
      <IconButton
        variant="fill"
        aria-label="search-button-icon"
        icon={<SearchIcon fontSize="lg" />}
        type="submit"
      />
    </Flex>
  );
}

export default SearchBox;
