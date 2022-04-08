import { Flex, useToast } from '@chakra-ui/react';
import shallow from 'zustand/shallow';
import { useKkshowSearchStore } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { FullPageSearchDrawer } from './FullPageSearchBox';
import { SearchInputBox } from './SearchInputBox';

interface SearchForm {
  keyword: string;
}
export function Searcher(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchStore = useKkshowSearchStore(
    (s) => ({
      appendKeyword: s.appendKeyword,
      closeSearchDrawer: s.closeSearchDrawer,
      closeSearchRecommendPopover: s.closeSearchRecommendPopover,
    }),
    shallow,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<SearchForm>();

  const focusOnInput = useCallback((): void => {
    if (inputRef && inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  //* 필터/검색 폼 제출
  const onSubmit: SubmitHandler<SearchForm> = (formData): void => {
    console.log('on submit');
    if (formData.keyword) {
      searchStore.appendKeyword(formData.keyword);
      router.push({ pathname: '/search', query: { keyword: formData.keyword } });
      queryClient.invalidateQueries('getSearchResults');
      searchStore.closeSearchDrawer();
      searchStore.closeSearchRecommendPopover();
    } else {
      focusOnInput();
      toast({ title: '검색어를 입력해주세요', status: 'error' });
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="keyword-search-form" onSubmit={methods.handleSubmit(onSubmit)}>
        {/* 데스크탑 검색 input */}
        <Flex display={{ base: 'none', md: 'flex' }} w={360}>
          <SearchInputBox inputRef={inputRef} />
        </Flex>

        {/* 모바일 검색 full-page drawer */}
        <Flex display={{ base: 'flex', md: 'none' }}>
          <FullPageSearchDrawer searchBoxInputRef={inputRef} />
        </Flex>
      </form>
    </FormProvider>
  );
}
export default Searcher;
