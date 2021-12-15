import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import useContractStyles from '../constants/Contract.style';
import terms, { Term } from '../constants/contractTerms';

export function ContractionAgreeDialog({
  isOpen,
  onClose,
  onSubmit,
  agreementFlag,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  onSubmit?: () => void;
  agreementFlag: boolean;
}): JSX.Element {
  const classes = useContractStyles();
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [checkedA, setCheckedA] = useState<boolean>(false);
  const [checkedB, setCheckedB] = useState<boolean>(false);
  const dialog = useDisclosure();

  function checkedAll(value: boolean): void {
    setCheckedA(value);
    setCheckedB(value);
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        checkedAll(false);
        onClose();
      }}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>이용약관</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack pb={3} spacing={4}>
            {/* 헤더 */}
            <Divider />
            {terms.map((term) => (
              <SimpleGrid key={term.state} columns={3}>
                <GridItem>
                  <Text>{term.title}</Text>
                </GridItem>
                <GridItem textAlign="center">
                  <Button
                    size="sm"
                    onClick={(): void => {
                      setSelectedTerm(term);
                      dialog.onOpen();
                    }}
                  >
                    약관보기
                  </Button>
                </GridItem>
                {!agreementFlag && (
                  <GridItem textAlign="center">
                    <Checkbox
                      size="md"
                      colorScheme="green"
                      isChecked={term.state === 'checkedA' ? checkedA : checkedB}
                      onChange={() => {
                        if (term.state === 'checkedA') {
                          setCheckedA(!checkedA);
                        } else {
                          setCheckedB(!checkedB);
                        }
                      }}
                    >
                      동의
                    </Checkbox>
                  </GridItem>
                )}
              </SimpleGrid>
            ))}
            <Divider />
            {/* 이용약관 동의 버튼 */}
            {!agreementFlag && (
              <>
                <Checkbox
                  size="md"
                  colorScheme="green"
                  isChecked={checkedA && checkedB}
                  onChange={() => {
                    if (checkedA && checkedB) {
                      checkedAll(false);
                    } else {
                      checkedAll(true);
                    }
                  }}
                >
                  전체 이용약관에 동의합니다.
                </Checkbox>
                <ButtonGroup justifyContent="flex-end">
                  <Button onClick={onClose}>취소</Button>
                  <Button
                    colorScheme="blue"
                    disabled={!(checkedA && checkedB)}
                    onClick={onSubmit}
                  >
                    확인
                  </Button>
                </ButtonGroup>
              </>
            )}

            {selectedTerm && (
              <Modal isOpen={dialog.isOpen} onClose={dialog.onClose} size="full">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{selectedTerm.title}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody maxW="6xl" mx="auto">
                    <div className={classes.inDialogContent}>
                      {selectedTerm.text.split('\n').map((sentence) => (
                        <p key={sentence}>{sentence}</p>
                      ))}
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
