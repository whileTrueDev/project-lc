import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
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
import { RefObject, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { RecentSearchedKeywords } from './RecentSearchedKeywords';

export const SEARCH_FORM_ID = 'kkshow-search-form';
export interface SearchForm {
  keyword: string;
}
export interface SearchInputBoxProps {
  inputRef?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  onSubmit: () => void;
}

export function DesktopSearchInputBox({
  inputRef,
  autoFocus,
  onSubmit,
}: SearchInputBoxProps): JSX.Element {
  const initialRef = useRef<HTMLInputElement>(null);

  const { register, setValue } = useFormContext<SearchForm>();
  const searchInputRegister = register('keyword');
  const realInputRef = useMergeRefs(inputRef || initialRef, searchInputRegister.ref);

  /** sticky 설정된 subnav에 가려지지 않기 위해 portal 사용함
   * -> 전역 store에 저장된 isOpen 값 사용하면 portal 때문에 팝오버가 2개 렌더링 됨(이유를 못찾음)
   * 전역 store가 아닌 SearchInputBox 내부에서 useDisclosure 값 사용도록 수정함
   * */
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleSubmit = (): void => {
    onSubmit();
    onClose(); // Searcher에서 전달되는 onSubmit에는 팝오버 닫기가 없음. 여기서 팝오버 닫기 실행
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
        </PopoverTrigger>

        {/* 검색 버튼 */}
        <SearchIconButton handleSubmit={handleSubmit} />

        <Portal>
          <PopoverContent zIndex="popover" rootProps={{ zIndex: 'popover' }}>
            <PopoverBody zIndex="popover">
              {/* 검색 도우미 (최근검색어, 추천검색어) */}
              <RecentSearchedKeywords
                bgColor="unset"
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

export default DesktopSearchInputBox;

/* 검색 버튼 */
export function SearchIconButton({
  handleSubmit,
}: {
  handleSubmit: () => void;
}): JSX.Element {
  return (
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
  );
}
