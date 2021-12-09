import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  ModalHeader,
  Stack,
  Heading,
  Divider,
  Modal,
  useDisclosure,
  Button,
  Checkbox,
} from '@chakra-ui/react';
import shortid from 'shortid';
import { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import useContractStyles from '../constants/Contract.style';
import terms from '../constants/contractTerms';

interface Term {
  title: string;
  state: string;
  text: string;
}

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
      isOpen={isOpen}
      onClose={() => {
        checkedAll(false);
        onClose();
      }}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody maxW="6xl" mx="5">
          <Stack pt={3} pb={3} spacing={6}>
            {/* 헤더 */}
            <Heading as="h4" size="lg" textAlign="center">
              이용약관
            </Heading>
            <Divider />
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
                  {!agreementFlag && (
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
                  )}
                </Grid>
              </div>
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
                        <p key={shortid.generate()}>{sentence}</p>
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
