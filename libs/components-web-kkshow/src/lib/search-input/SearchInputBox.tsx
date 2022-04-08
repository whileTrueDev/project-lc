import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorModeValue,
  useMergeRefs,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { useKkshowSearchStore } from '@project-lc/stores';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import SearchHelpPopover from './SearchHelpPopover';

export interface SearchForm {
  keyword: string;
}
export interface SearchInputBoxProps {
  inputRef?: RefObject<HTMLInputElement>;
  searchButtonProps?: Omit<IconButtonProps, 'aria-label'>;
}

export function SearchInputBox({
  inputRef,
  searchButtonProps,
}: SearchInputBoxProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  const initialRef = useRef<HTMLInputElement>(null);
  const isSearchPopoverOpen = useKkshowSearchStore((s) => s.isSearchPopoverOpen);
  const closeSearchRecommendPopover = useKkshowSearchStore(
    (s) => s.closeSearchRecommendPopover,
  );
  const openSearchRecommendPopover = useKkshowSearchStore(
    (s) => s.openSearchRecommendPopover,
  );

  const { register, watch, setValue } = useFormContext<SearchForm>();
  const searchInputRegister = register('keyword');
  const realInputRef = useMergeRefs(inputRef || initialRef, searchInputRegister.ref);

  const focusOnInput = useCallback((): void => {
    const ref = inputRef || initialRef;
    if (ref && ref.current) ref.current.focus();
  }, [inputRef]);

  useEffect(() => {
    if (isMobileSize) focusOnInput();
  }, [focusOnInput, isMobileSize]);

  return (
    <Flex w="100%" h="100%" pos="relative">
      <InputGroup>
        <Input
          {...searchInputRegister}
          ref={realInputRef}
          autoFocus={!!isMobileSize}
          variant="outline"
          placeholder="검색어를 입력하세요"
          rounded="md"
          type="search"
          autoComplete="off"
          bgColor={useColorModeValue('white', 'gray.600')}
          color={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
          onKeyDown={(e) => {
            if (e.code === 'Escape') closeSearchRecommendPopover();
          }}
          onInput={() => {
            if (!isSearchPopoverOpen) openSearchRecommendPopover();
          }}
          onClick={() => {
            if (!isSearchPopoverOpen) openSearchRecommendPopover();
          }}
          onFocus={() => openSearchRecommendPopover()}
          onBlur={() => closeSearchRecommendPopover()}
        />
        {/* 삭제 버튼 */}
        {isMobileSize && watch('keyword') && (
          <InputRightElement>
            <IconButton
              variant="fill"
              aria-label="erase-button-icon"
              icon={<MdCancel color="gray" />}
              onClick={() => {
                setValue('keyword', '');
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>
      {/* 검색 버튼 */}
      <Tooltip label="검색" fontSize="xs">
        <IconButton
          mr={2}
          ml={1}
          variant="fill"
          aria-label="search-button-icon"
          icon={<SearchIcon />}
          {...searchButtonProps}
          type="submit"
        />
      </Tooltip>

      {/* 검색 도우미 (최근검색어, 추천검색어) 팝오버 */}
      <SearchHelpPopover
        onItemClick={(item) => {
          setValue('keyword', item);
          closeSearchRecommendPopover();
        }}
      />
    </Flex>
  );
}

export default SearchInputBox;
