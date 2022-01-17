import {
  Button,
  ButtonGroup,
  Center,
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
import broadcasterTerms from '@project-lc/components-constants/broadcasterContractTerms';
import sellerTerms from '@project-lc/components-constants/sellerContractTerms';
import { Term } from '@project-lc/components-constants/termType';

export function ContractionAgreeDialog({
  isOpen,
  onClose,
  onSubmit,
  agreementFlag,
  userType,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  onSubmit?: () => void;
  agreementFlag: boolean;
  userType: 'seller' | 'broadcaster';
}): JSX.Element {
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [checkedA, setCheckedA] = useState<boolean>(false);
  const [checkedB, setCheckedB] = useState<boolean>(false);
  const [sellerAgreementCheck, setSellerAgreementCheck] = useState<boolean>(false);
  const dialog = useDisclosure();

  function checkedAll(value: boolean): void {
    setCheckedA(value);
    setCheckedB(value);
  }

  function sellerCheckAll(value: boolean): void {
    setSellerAgreementCheck(value);
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
            <Divider />
            {/* 헤더 */}
            {userType === 'seller' &&
              sellerTerms.map((term) => (
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
                        isChecked={sellerAgreementCheck}
                        onChange={() => {
                          setSellerAgreementCheck(!sellerAgreementCheck);
                        }}
                      >
                        동의
                      </Checkbox>
                    </GridItem>
                  )}
                </SimpleGrid>
              ))}

            {userType === 'broadcaster' &&
              broadcasterTerms.map((term) => (
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
                          if (term.state === 'checkedA') setCheckedA(!checkedA);
                          if (term.state === 'checkedB') setCheckedB(!checkedB);
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
            {userType === 'seller' && !agreementFlag && (
              <>
                <Checkbox
                  size="md"
                  colorScheme="green"
                  isChecked={sellerAgreementCheck}
                  onChange={() => {
                    if (sellerAgreementCheck) sellerCheckAll(false);
                    else sellerCheckAll(true);
                  }}
                >
                  전체 이용약관에 동의합니다.
                </Checkbox>
                <ButtonGroup justifyContent="flex-end">
                  <Button onClick={onClose}>취소</Button>
                  <Button
                    colorScheme="blue"
                    disabled={!sellerAgreementCheck}
                    onClick={onSubmit}
                  >
                    확인
                  </Button>
                </ButtonGroup>
              </>
            )}

            {userType === 'broadcaster' && !agreementFlag && (
              <>
                <Checkbox
                  size="md"
                  colorScheme="green"
                  isChecked={checkedA && checkedB}
                  onChange={() => {
                    if (checkedA && checkedB) checkedAll(false);
                    else checkedAll(true);
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
              <Modal
                isOpen={dialog.isOpen}
                onClose={dialog.onClose}
                size="5xl"
                scrollBehavior="inside"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{selectedTerm.title}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody maxW="6xl" mx="auto">
                    <Text whiteSpace="pre-line">{selectedTerm.text}</Text>
                    {!agreementFlag && (
                      <Center m={2}>
                        <Checkbox
                          size="md"
                          colorScheme="green"
                          isChecked={
                            selectedTerm.state === 'checkedA' ? checkedA : checkedB
                          }
                          onChange={() => {
                            if (selectedTerm.state === 'checkedA') {
                              setCheckedA(!checkedA);
                            } else {
                              setCheckedB(!checkedB);
                            }
                            dialog.onClose();
                          }}
                        >
                          위 약관에 동의합니다.
                        </Checkbox>
                      </Center>
                    )}
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
