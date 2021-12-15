import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Stack,
  Center,
  Divider,
  Modal,
  useDisclosure,
  Button,
  Checkbox,
  HStack,
  VStack,
  Text,
  useToast,
  GridItem,
} from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import { useProfile, useUpdateContractionAgreementMutation } from '@project-lc/hooks';
import { Grid, Typography } from '@material-ui/core';
import useContractStyles from '../../constants/Contract.style';
import terms from '../../constants/contractTerms';
import { SettingSectionLayout } from '../SettingSectionLayout';

interface Term {
  title: string;
  state: string;
  text: string;
}

export function ContractionAgreementSection({
  completeStep,
}: {
  completeStep: () => void;
}): JSX.Element {
  const { data } = useProfile();
  const toast = useToast();
  const classes = useContractStyles();
  const dialog = useDisclosure();
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [checkedA, setCheckedA] = useState<boolean>(false);
  const [checkedB, setCheckedB] = useState<boolean>(false);

  function checkedAll(value: boolean): void {
    setCheckedA(value);
    setCheckedB(value);
  }

  const mutation = useUpdateContractionAgreementMutation();
  const 계약동의여부 = useMemo<boolean>(
    () => !!data?.agreementFlag,
    [data?.agreementFlag],
  );

  useEffect(() => {
    if (계약동의여부) {
      completeStep();
    }
  }, [계약동의여부, completeStep]);

  function onSubmit(): void {
    const onSuccess = (): void => {
      // 성공시
      toast({ title: '약관동의가 완료되었습니다.', status: 'success' });
    };
    const onError = (): void => {
      toast({
        title: '약관동의중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        status: 'error',
      });
    };

    if (!data?.email) {
      return;
    }

    mutation
      .mutateAsync({ email: data?.email, agreementFlag: true })
      .then((result) => {
        if (result) onSuccess();
        else onError();
      })
      .catch((err) => {
        console.log(err);
        onError();
      });
  }

  return (
    <Stack pt={3} pb={3} spacing={10}>
      <Center>
        <VStack spacing={0}>
          <Divider mb={3} borderWidth={0.5} />
          <Text fontSize="md" fontWeight="semibold">
            크크쇼 서비스를 정상적으로 이용하기 위해서는 이용 동의가 필요합니다.
          </Text>
          {계약동의여부 || (
            <>
              <Text fontSize="md" fontWeight="semibold">
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
      {계약동의여부 ? (
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
                  <Text fontSize="lg" as="u">
                    이용동의 완료
                  </Text>
                  <CheckIcon color="green.500" ml={1} />
                </GridItem>
              </HStack>
            </SettingSectionLayout>
            <Text colorScheme="gray" fontWeight="thin">
              아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
            </Text>
          </VStack>
        </Center>
      ) : (
        <Center>
          <Stack w={['6xl', 'xl']} spacing={5}>
            {terms.map((term) => (
              <div key={term.state}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Typography component="p" className={classes.termTitle}>
                      {term.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      width="150px"
                      size="sm"
                      onClick={(): void => {
                        setSelectedTerm(term);
                        dialog.onOpen();
                      }}
                    >
                      약관보기
                    </Button>
                  </Grid>
                  <Grid item>
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
                  </Grid>
                </Grid>
              </div>
            ))}
            <Divider />
            {/* 이용약관 동의 버튼 */}
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
  );
}
