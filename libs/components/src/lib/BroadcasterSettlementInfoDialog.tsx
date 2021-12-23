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
import { Box, Heading, useToast, VStack } from '@chakra-ui/react';
import { TaxationType } from '@prisma/client';
import { useBroadcasterSettlementInfoMutation, useProfile } from '@project-lc/hooks';
import { BroadcasterSettlementInfoDto, UserProfileRes } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import { FormProvider, useForm } from 'react-hook-form';
import { boxStyle } from '../constants/commonStyleProps';
import BroadcasterSettlementInfoAccount, {
  BroadcasterAccountData,
} from './BroadcasterSettlementInfoAccount';
import BroadcasterSettlementInfoContractor, {
  BroadcasterContractorData,
} from './BroadcasterSettlementInfoContractor';
import BroadcasterSettlementInfoTerms, {
  BroadcasterAgreements,
} from './BroadcasterSettlementInfoTerms';

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

// 정산정보 폼 데이터 타입
type BroadcasterSettlementInfoFormData = BroadcasterContractorData &
  BroadcasterAccountData &
  BroadcasterAgreements;

export interface BroadcasterSettlementInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/** BroadcasterSettlementInfoFormData -> settlementInfoDataDto에 맞게 변환 */
async function toDto(
  profileData: UserProfileRes,
  data: BroadcasterSettlementInfoFormData,
): Promise<BroadcasterSettlementInfoDto> {
  const {
    idCardImageName,
    idCardImageFile,
    accountImageFile,
    accountImageName,
    idCardNumber1,
    idCardNumber2,
    phone1,
    phone2,
    phone3,
    accountNumber,
    taxType,
    ...rest
  } = data;

  // 신분증 사진 s3 업로드
  const savedIdCardImageName = await s3.s3UploadImage({
    filename: idCardImageName,
    file: idCardImageFile,
    type: 'broadcaster-id-card',
    userMail: profileData?.email,
  });
  // 통장사본 사진 s3 업로드
  const savedAccountImageName = await s3.s3UploadImage({
    filename: accountImageName,
    file: accountImageFile,
    type: 'broadcaster-account-image',
    userMail: profileData?.email,
  });

  const dto = {
    type: taxType as TaxationType,
    idCardNumber: `${idCardNumber1}-${idCardNumber2}`,
    phoneNumber: `${phone1}-${phone2}-${phone3}`,
    accountNumber: accountNumber.toString(),
    idCardImageName: savedIdCardImageName || '',
    accountImageName: savedAccountImageName || '',
    broadcasterId: profileData.id,
    ...rest,
  };

  return dto;
}

export function BroadcasterSettlementInfoDialog({
  isOpen,
  onClose,
}: BroadcasterSettlementInfoDialogProps): JSX.Element {
  const { data: profileData } = useProfile();
  const toast = useToast();

  const methods = useForm<BroadcasterSettlementInfoFormData>();
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const uploadRequest = useBroadcasterSettlementInfoMutation();

  const regist = async (data: BroadcasterSettlementInfoFormData): Promise<void> => {
    if (!profileData) return;

    // data -> settlementInfoDataDto에 맞게 변환
    const dto: BroadcasterSettlementInfoDto = await toDto(profileData, data);

    uploadRequest
      .mutateAsync(dto)
      .then((res) => {
        toast({
          title: '정산정보를 제출하였습니다. 검수 결과를 기다려주세요.',
          status: 'success',
        });
        reset();
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '정산정보를 제출하는 중 오류가 발생하였습니다', status: 'error' });
      });
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
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              등록하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export default BroadcasterSettlementInfoDialog;
