import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Box, GridItem, Heading, useColorModeValue, VStack } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import { boxStyle } from '../constants/commonStyleProps';
import BroadcasterSettlementInfoAccount from './BroadcasterSettlementInfoAccount';
import BroadcasterSettlementInfoContractor from './BroadcasterSettlementInfoContractor';
import BroadcasterSettlementInfoTerms from './BroadcasterSettlementInfoTerms';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';

export function CustomRowItem({
  header,
  body,
}: {
  header: string;
  body: JSX.Element;
}): JSX.Element {
  return (
    <>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>{header}</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>{body}</GridItem>
    </>
  );
}

/** 이용약관 등 문구 표시하는 컴포넌트 */
export function TermBox({ text }: { text: string }): JSX.Element {
  return (
    <Box
      maxHeight={100}
      {...boxStyle}
      mb={1}
      overflowY="auto"
      fontSize="sm"
      whiteSpace="pre-line"
    >
      {text}
    </Box>
  );
}

/** 각 영역별 제목 표시 */
export function SectionHeading({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Heading size="sm" my={1}>
      {children}
    </Heading>
  );
}

export interface BroadcasterSettlementInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcasterSettlementInfoDialog({
  isOpen,
  onClose,
}: BroadcasterSettlementInfoDialogProps): JSX.Element {
  const { data: profileData } = useProfile();

  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const regist = (data: any): void => {
    console.log('regist', data);
  };
  return (
    <Modal isOpen={isOpen} size="3xl" onClose={onClose} closeOnEsc={false}>
      <ModalOverlay />
      <FormProvider {...methods}>
        <ModalContent as="form" onSubmit={handleSubmit(regist)}>
          <ModalHeader>정산 정보 등록</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="stretch" spacing={5}>
              {/* 계약자 정보 */}
              <BroadcasterSettlementInfoContractor />
              {/* 정산계좌정보 */}
              <BroadcasterSettlementInfoAccount />
              {/* 서비스 이용 및 정산등록 동의 */}
              <BroadcasterSettlementInfoTerms />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              등록하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export default BroadcasterSettlementInfoDialog;
