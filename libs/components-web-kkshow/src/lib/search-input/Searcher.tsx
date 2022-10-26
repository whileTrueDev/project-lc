import { Flex, useToast } from '@chakra-ui/react';
import { useKkshowSearchStore } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import shallow from 'zustand/shallow';
import { FullPageSearchDrawer } from './FullPageSearchBox';
import { DesktopSearchInputBox } from './DesktopSearchInputBox';

interface SearchForm {
  keyword: string;
}
export function Searcher(): JSX.Element {
  const toast = useToast();
  const router = useRouter();

  const searchStore = useKkshowSearchStore(
    (s) => ({
      appendKeyword: s.appendKeyword,
      closeSearchDrawer: s.closeSearchDrawer,
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
    if (formData.keyword) {
      searchStore.appendKeyword(formData.keyword);

      router.push({ pathname: '/search', query: { keyword: formData.keyword } });
      searchStore.closeSearchDrawer();
    } else {
      focusOnInput();
      toast({ title: '검색어를 입력해주세요', status: 'error' });
    }
  };

  return (
    <FormProvider {...methods}>
      {/* 데스크탑 검색 input */}
      <Flex display={{ base: 'none', md: 'flex' }} w={360}>
        <DesktopSearchInputBox
          inputRef={inputRef}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      </Flex>

      {/* 모바일 검색 full-page drawer */}
      <Flex display={{ base: 'flex', md: 'none' }}>
        <FullPageSearchDrawer
          inputRef={inputRef}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      </Flex>
    </FormProvider>
  );
}
export default Searcher;
