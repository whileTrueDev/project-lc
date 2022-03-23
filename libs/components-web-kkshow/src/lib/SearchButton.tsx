import { IconButton, Tooltip } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

export function SearchButton(): JSX.Element {
  const router = useRouter();
  return (
    <Tooltip label="검색" fontSize="xs">
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        icon={<SearchIcon />}
        aria-label="toggle search"
        onClick={() => {
          router.push('/search');
        }}
        _hover={{}}
        display={{ base: 'flex', xl: 'none' }}
      />
    </Tooltip>
  );
}
