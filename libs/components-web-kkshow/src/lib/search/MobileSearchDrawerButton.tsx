import { IconButton, Tooltip } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useSearchDrawer } from '@project-lc/stores';

export function MobileSearchDrawerButton(): JSX.Element {
  const setIsOpen = useSearchDrawer((s) => s.setIsOpen);
  return (
    <Tooltip label="검색" fontSize="xs">
      <IconButton
        size="md"
        fontSize="lg"
        variant="unstyle"
        color="current"
        icon={<SearchIcon />}
        aria-label="toggle search"
        onClick={() => {
          setIsOpen(true);
        }}
        display={{ base: 'flex', md: 'none' }}
      />
    </Tooltip>
  );
}
