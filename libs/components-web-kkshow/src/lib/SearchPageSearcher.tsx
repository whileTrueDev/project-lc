import { ChevronLeftIcon } from '@chakra-ui/icons';
import { InputGroup, Box, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchBox } from './SearchBox';

export function SearchPageSearcher(): JSX.Element {
  const router = useRouter();
  return (
    <>
      <InputGroup
        size="md"
        mt={3}
        display={{ base: 'flex', md: 'none' }}
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
    </>
  );
}
export default SearchPageSearcher;
