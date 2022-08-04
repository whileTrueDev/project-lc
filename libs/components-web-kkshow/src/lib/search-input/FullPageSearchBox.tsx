import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorModeValue,
  useMergeRefs,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { useKkshowSearchStore } from '@project-lc/stores';
import { RefObject, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import { RecentSearchedKeywords } from './RecentSearchedKeywords';
import {
  SearchForm,
  SearchIconButton,
  SearchInputBoxProps,
} from './DesktopSearchInputBox';

type FullPageSearchBoxProps = SearchInputBoxProps;
export function FullPageSearchBox({
  inputRef,
  onSubmit,
}: FullPageSearchBoxProps): JSX.Element {
  const closeSearchDrawer = useKkshowSearchStore((s) => s.closeSearchDrawer);

  const onKeywordClick = (item: string): void => {
    setValue('keyword', item);
    onSubmit();
  };

  const { isMobileSize } = useDisplaySize();

  const initialRef = useRef<HTMLInputElement>(null);

  const { register, watch, setValue } = useFormContext<SearchForm>();
  const searchInputRegister = register('keyword');
  const realInputRef = useMergeRefs(inputRef || initialRef, searchInputRegister.ref);
  const clearSearchInput = (): void => {
    setValue('keyword', '');
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
        <InputGroup>
          <Input
            {...searchInputRegister}
            ref={realInputRef}
            variant="outline"
            placeholder="검색어를 입력하세요"
            rounded="md"
            type="search"
            autoComplete="off"
            bgColor={useColorModeValue('white', 'gray.600')}
            color={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
          {/* 삭제 버튼 */}
          {isMobileSize && watch('keyword') && (
            <InputRightElement>
              <IconButton
                variant="fill"
                aria-label="erase-button-icon"
                icon={<MdCancel color="gray" />}
                onClick={clearSearchInput}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* 검색 버튼 */}
        <SearchIconButton handleSubmit={onSubmit} />
      </Flex>

      {/* 최근검색어 */}
      <Flex my={4} flexDirection="column">
        <RecentSearchedKeywords bgColor="unset" onItemClick={onKeywordClick} />
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
  inputRef,
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
        initialFocusRef={inputRef}
        closeOnEsc
        trapFocus
        portalProps={{ containerRef }}
      >
        <DrawerOverlay display={{ base: 'flex', md: 'none' }} />
        <DrawerContent display={{ base: 'flex', md: 'none' }}>
          <DrawerBody p={0}>
            <FullPageSearchBox inputRef={inputRef} onSubmit={onSubmit} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default FullPageSearchBox;
