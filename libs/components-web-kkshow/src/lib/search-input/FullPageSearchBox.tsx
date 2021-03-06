import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useKkshowSearchStore } from '@project-lc/stores';
import { RefObject } from 'react';
import { useFormContext } from 'react-hook-form';
import { SearchRecentKeywords } from './SearchHelpPopover';
import { SearchForm, SearchInputBox, SearchInputBoxProps } from './SearchInputBox';

interface FullPageSearchBoxProps {
  searchBoxInputRef?: SearchInputBoxProps['inputRef'];
  onSubmit: () => void;
}
export function FullPageSearchBox({
  searchBoxInputRef,
  onSubmit,
}: FullPageSearchBoxProps): JSX.Element {
  const closeSearchDrawer = useKkshowSearchStore((s) => s.closeSearchDrawer);
  const { setValue } = useFormContext<SearchForm>();

  const onKeywordClick = (item: string): void => {
    setValue('keyword', item);
    onSubmit();
  };

  return (
    <Box>
      <Flex my={4} display={{ base: 'flex', xl: 'none' }} alignItems="center">
        <IconButton
          ml={2}
          mr={1}
          aria-label="exit-search-drawer"
          onClick={() => closeSearchDrawer()}
          variant="unstyle"
          icon={<ChevronLeftIcon w="30px" h="35px" />}
        />
        <SearchInputBox inputRef={searchBoxInputRef} onSubmit={onSubmit} autoFocus />
      </Flex>

      {/* 최근검색어 */}
      <Flex my={4} flexDirection="column">
        <SearchRecentKeywords bgColor="unset" onItemClick={onKeywordClick} />
      </Flex>
    </Box>
  );
}

interface FullPageSearchDrawerProps extends FullPageSearchBoxProps {
  containerRef?: RefObject<HTMLElement | null>;
  onSubmit: () => void;
}
export function FullPageSearchDrawer({
  containerRef,
  searchBoxInputRef,
  onSubmit,
}: FullPageSearchDrawerProps): JSX.Element {
  const { isSearchDrawerOpen, openSearchDrawer, closeSearchDrawer } =
    useKkshowSearchStore();

  return (
    <>
      {/* 모바일 검색drawer 오픈 버튼 */}
      <Tooltip label="검색" fontSize="xs">
        <IconButton
          size="md"
          fontSize="lg"
          variant="unstyle"
          icon={<SearchIcon />}
          aria-label="toggle search"
          onClick={openSearchDrawer}
        />
      </Tooltip>
      <Drawer
        onClose={closeSearchDrawer}
        isOpen={isSearchDrawerOpen}
        size="full"
        initialFocusRef={searchBoxInputRef}
        closeOnEsc
        trapFocus
        portalProps={{ containerRef }}
      >
        <DrawerOverlay display={{ base: 'flex', md: 'none' }} />
        <DrawerContent display={{ base: 'flex', md: 'none' }}>
          <DrawerBody p={0}>
            <FullPageSearchBox
              searchBoxInputRef={searchBoxInputRef}
              onSubmit={onSubmit}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default FullPageSearchBox;
