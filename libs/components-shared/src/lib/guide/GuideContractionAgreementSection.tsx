import { CheckIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Checkbox,
  Divider,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Term } from '@project-lc/components-constants/termType';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { SettingSectionLayout } from '@project-lc/components-layout/SettingSectionLayout';
import {
  useBroadcasterUpdateContractionAgreementMutation,
  useProfile,
  useSellerUpdateContractionAgreementMutation,
  useTerms,
} from '@project-lc/hooks';
import { guideConditionStore } from '@project-lc/stores';
import { parseErrorObject } from '@project-lc/utils-frontend';
import { useEffect, useMemo, useState } from 'react';

export function GuideContractionAgreementSection({
  userType,
}: {
  userType: 'seller' | 'broadcaster';
}): JSX.Element {
  const { broadcasterTerms, sellerTerms, isLoading } = useTerms({ userType });
  const { data } = useProfile();
  const toast = useToast();
  const dialog = useDisclosure();

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [checkedA, setCheckedA] = useState<boolean>(false);
  const [checkedB, setCheckedB] = useState<boolean>(false);
  const [sellerAgreementCheck, setSellerAgreementCheck] = useState<boolean>(false);
  const { completeStep } = guideConditionStore();

  function checkedAll(value: boolean): void {
    setCheckedA(value);
    setCheckedB(value);
  }

  function sellerCheckAll(value: boolean): void {
    setSellerAgreementCheck(value);
  }

  const broadcasterMutation = useBroadcasterUpdateContractionAgreementMutation();
  const sellerMutation = useSellerUpdateContractionAgreementMutation();

  const 계약동의여부 = useMemo<boolean>(
    () => !!data?.agreementFlag,
    [data?.agreementFlag],
  );

  useEffect(() => {
    if (계약동의여부) {
      completeStep();
    }
  }, [계약동의여부, completeStep]);

  const onSubmit = (): void => {
    const onSuccess = (): void => {
      // 성공시
      toast({ title: '약관동의가 완료되었습니다.', status: 'success' });
    };
    const onError = (err?: any): void => {
      const { status, message } = parseErrorObject(err);
      toast({
        title: '약관동의중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        description: status ? `code: ${status} - message: ${message}` : undefined,
        status: 'error',
      });
    };

    if (!data?.id) {
      return;
    }
    if (userType === 'broadcaster') {
      broadcasterMutation
        .mutateAsync({ id: data?.id, agreementFlag: true })
        .then((result) => {
          if (result) onSuccess();
          else onError();
        })
        .catch((err) => {
          onError(err);
        });
    }
    if (userType === 'seller') {
      sellerMutation
        .mutateAsync({ id: data?.id, agreementFlag: true })
        .then((result) => {
          if (result) onSuccess();
          else onError();
        })
        .catch((err) => {
          onError(err);
        });
    }
  };
  if (isLoading) return <Spinner />;

  return (
    <Stack pt={3} pb={3} spacing={10}>
      <Center>
        <VStack spacing={0}>
          <Text fontSize="md">
            크크쇼 서비스를 정상적으로 이용하기 위해서는 이용 동의가 필요합니다.
          </Text>
          {계약동의여부 || (
            <>
              <Text fontSize="md">
                아래의 약관들에 대해서 동의한 이후, [이용동의완료] 버튼을 클릭해
                완료해주세요.
              </Text>
              <Text fontSize="sm" colorScheme="gray" fontWeight="thin">
                약관보기를 클릭하여 약관을 확인한 후, 동의를 누르세요.
              </Text>
            </>
          )}
        </VStack>
      </Center>

      {계약동의여부 && (
        <Center>
          <VStack w={['6xl', 'xl']}>
            <SettingSectionLayout title="이용 동의">
              <HStack spacing={6}>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold">
                    현재 이용동의 상태
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <Text>이용동의 완료</Text>
                  <CheckIcon color="green.500" ml={1} />
                </GridItem>
              </HStack>
            </SettingSectionLayout>
            <Text color="GrayText">
              아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
            </Text>
          </VStack>
        </Center>
      )}

      {userType === 'seller' && !계약동의여부 && (
        <Center>
          <Stack w={['6xl', 'xl']} spacing={5}>
            {sellerTerms.map((term) => (
              <SimpleGrid key={term.state} columns={3}>
                <GridItem>
                  <Text>
                    {term.title}{' '}
                    {term.required && (
                      <Text as="span" fontSize="xs" color="green.500">
                        (필수)
                      </Text>
                    )}
                  </Text>
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
                <GridItem>
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
              </SimpleGrid>
            ))}
            <Divider />
            {/* 이용약관 모두 동의 버튼 */}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                width="150px"
                size="sm"
                disabled={!sellerAgreementCheck}
                onClick={onSubmit}
              >
                확인
              </Button>
            </div>
          </Stack>
        </Center>
      )}

      {userType === 'broadcaster' && !계약동의여부 && (
        <Center>
          <Stack w={['6xl', 'xl']} spacing={5}>
            {broadcasterTerms.map((term) => (
              <SimpleGrid key={term.state} columns={3}>
                <GridItem>
                  <Text>
                    {term.title}{' '}
                    {term.required && (
                      <Text as="span" fontSize="xs" color="green.500">
                        (필수)
                      </Text>
                    )}
                  </Text>
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
                <GridItem>
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
              </SimpleGrid>
            ))}
            <Divider />
            {/* 이용약관 모두 동의 버튼 */}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                width="150px"
                size="sm"
                disabled={!(checkedA && checkedB)}
                onClick={onSubmit}
              >
                확인
              </Button>
            </div>
          </Stack>
        </Center>
      )}

      {userType === 'seller' && selectedTerm && (
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
              <HtmlStringBox htmlString={selectedTerm.text} />
              {!계약동의여부 && (
                <Center m={2}>
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={sellerAgreementCheck}
                    onChange={() => {
                      setSellerAgreementCheck(!sellerAgreementCheck);
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

      {userType === 'broadcaster' && selectedTerm && (
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
              <HtmlStringBox htmlString={selectedTerm.text} />
              {!계약동의여부 && (
                <Center m={2}>
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={selectedTerm.state === 'checkedA' ? checkedA : checkedB}
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
  );
}
