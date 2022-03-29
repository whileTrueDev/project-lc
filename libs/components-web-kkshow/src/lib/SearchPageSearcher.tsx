import { ChevronLeftIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Text,
  Box,
  Flex,
  useColorModeValue,
  InputGroup,
  IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchBox } from './SearchBox';

export function SearchPageSearcher(): JSX.Element {
  const router = useRouter();

  const localStorageData = JSON.parse(
    window.localStorage.getItem('searchKeyword') || '[]',
  );

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
          display={{ base: 'flex' }}
          onClick={() => router.back()}
        >
          <ChevronLeftIcon w="30px" h="35px" />
        </Box>
        <SearchBox />
      </InputGroup>
      <Flex m={2} flexDirection="column">
        <Text fontWeight="bold">최근 검색어</Text>
        <Flex mt={2} spacing={2} direction="column">
          {localStorageData?.map((item: string) => (
            <Flex key={item} justifyContent="space-between" alignItems="center">
              <Text>{item}</Text>
              <IconButton
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
