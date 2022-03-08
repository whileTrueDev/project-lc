import { SearchIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';

export function GlobalSearcher(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Tooltip label="검색" fontSize="xs">
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          color="current"
          icon={<SearchIcon />}
          aria-label="toggle search"
          onClick={() => {
            onOpen();
            initialRef.current?.focus();
          }}
          _hover={{}}
          display={{ base: 'flex', sm: 'none' }}
        />
      </Tooltip>

      <InputGroup size="sm" w={240} display={{ base: 'none', sm: 'flex' }}>
        <Input
          ref={initialRef}
          variant="unstyled"
          placeholder="검색어를 입력하세요"
          rounded="md"
          bgColor="blue.400"
          p={2}
          pr={8}
        />
        <InputRightElement>
          <IconButton
            variant="unstyled"
            aria-label="search-button-icon"
            icon={<SearchIcon fontSize="lg" />}
          />
        </InputRightElement>
      </InputGroup>

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={6} pb={4}>
            <Text fontSize="lg" fontWeight="bold">
              검색어를입력하세요.
            </Text>
            <InputGroup>
              <Input
                ref={initialRef}
                variant="flushed"
                placeholder="제품/크리에이터를 검색하세요"
              />
              <InputRightElement>
                <IconButton
                  variant="unstyled"
                  aria-label="search-button-icon"
                  icon={<SearchIcon color="blue.500" fontSize="xl" />}
                  onClick={() => {
                    alert('검색클릭');
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
export default GlobalSearcher;
