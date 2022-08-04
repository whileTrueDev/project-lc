import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { RefObject, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import { SearchRecentKeywords } from './SearchHelpPopover';

export const SEARCH_FORM_ID = 'kkshow-search-form';
export interface SearchForm {
  keyword: string;
}
export interface SearchInputBoxProps {
  inputRef?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  onSubmit: () => void;
}

export function SearchInputBox({
  inputRef,
  autoFocus,
  onSubmit,
}: SearchInputBoxProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  const initialRef = useRef<HTMLInputElement>(null);

  const { register, watch, setValue } = useFormContext<SearchForm>();
  const searchInputRegister = register('keyword');
  const realInputRef = useMergeRefs(inputRef || initialRef, searchInputRegister.ref);
  const clearSearchInput = (): void => {
    setValue('keyword', '');
  };

  /** sticky 설정된 subnav에 가려지지 않기 위해 portal 사용함
   * -> 전역 store에 저장된 isOpen 값 사용하면 portal 때문에 팝오버가 2개 렌더링 됨(이유를 못찾음)
   * 전역 store가 아닌 SearchInputBox 내부에서 useDisclosure 값 사용도록 수정함
   * */
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleSubmit = (): void => {
    onSubmit();
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      initialFocusRef={inputRef}
    >
      <Flex w="100%" h="100%" pos="relative">
        <PopoverTrigger>
          <InputGroup>
            <Input
              {...searchInputRegister}
              ref={realInputRef}
              autoFocus={autoFocus}
              variant="outline"
              placeholder="검색어를 입력하세요"
              rounded="md"
              type="search"
              autoComplete="off"
              bgColor={useColorModeValue('white', 'gray.600')}
              color={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
              onKeyDown={(e) => {
                if (e.code === 'Escape') {
                  onClose();
                }
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              onInput={() => {
                if (!isOpen) onOpen();
              }}
              onClick={() => {
                if (!isOpen) onOpen();
              }}
              onFocus={() => {
                if (!isOpen) onOpen();
              }}
              onBlur={() => {
                if (isOpen) onClose();
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
        </PopoverTrigger>

        {/* 검색 버튼 */}
        <Tooltip label="검색" fontSize="xs">
          <IconButton
            mr={2}
            ml={1}
            variant="fill"
            aria-label="search-button-icon"
            icon={<SearchIcon />}
            onClick={handleSubmit}
          />
        </Tooltip>

        <Portal>
          <PopoverContent zIndex="popover" rootProps={{ zIndex: 'popover' }}>
            <PopoverBody zIndex="popover">
              {/* 검색 도우미 (최근검색어, 추천검색어) 팝오버 */}
              <SearchRecentKeywords
                onItemClick={(item) => {
                  setValue('keyword', item);
                  handleSubmit();
                  onClose();
                }}
              />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Flex>
    </Popover>
  );
}

export default SearchInputBox;
