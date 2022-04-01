import { ChevronLeftIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Text,
  Box,
  Flex,
  useColorModeValue,
  InputGroup,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useKkshowSearchStore, useSearchDrawer } from '@project-lc/stores';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SearchBox, SearchInput } from './SearchBox';
import { deleteLocalStorageSearchKeyword } from './SearchPopover';

export function SearchPageSearcher(): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { keyword, localStorage, setLocalStorage } = useKkshowSearchStore();
  const setKeyword = useKkshowSearchStore((s) => s.setKeyword);

  const { handleSubmit } = useForm<SearchInput>();

  const setIsOpen = useSearchDrawer((s) => s.setIsOpen);

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
      setIsOpen(false);
    } else {
      toast({
        title: '검색어를 입력해주세요',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    setLocalStorage(JSON.parse(window.localStorage.getItem('searchKeyword') || '[]'));
  }, [setLocalStorage]);

  return (
    <Box>
      <InputGroup
        size="md"
        mt={3}
        display={{ base: 'flex', xl: 'none' }}
        alignItems="center"
      >
        <Box
          as="button"
          color={useColorModeValue('gray.600', 'gray.200')}
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeftIcon w="30px" h="35px" />
        </Box>
        <SearchBox />
      </InputGroup>
      <Flex m={2} flexDirection="column" as="form" onSubmit={handleSubmit(onSubmit)}>
        <Text fontWeight="bold">최근 검색어</Text>
        <Flex mt={2} spacing={2} direction="column">
          {localStorage?.length === 0 && <Text>최근 검색어가 없습니다.</Text>}
          {localStorage?.map((item: string) => (
            <Flex key={item} justifyContent="space-between" alignItems="center">
              <Text as="button" onClick={() => setKeyword(item)} type="submit">
                {item}
              </Text>
              <IconButton
                onClick={() => {
                  deleteLocalStorageSearchKeyword(item, setLocalStorage);
                }}
                m={1}
                variant="fill"
                aria-label="search-button-icon"
                icon={<SmallCloseIcon />}
                color="gray"
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
export default SearchPageSearcher;
