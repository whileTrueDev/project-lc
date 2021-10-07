import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  Button,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BusinessRegistrationDto } from '@project-lc/shared-types';
import {
  SettlementInfoRefetchType,
  useBusinessRegistrationMutation,
  s3,
  useProfile,
} from '@project-lc/hooks';

import { BusinessRegistrationForm } from './BusinessRegistrationForm';

// 사업자 등록증 이미지에 대한 DTO
type BusinessRegistrationImageDto = {
  businessRegistrationImage: File | null;
  businessRegistrationImageName: string | null;
};

// 통신판매업 신고번호 및 이미지에 대한 DTO
type MailOrderSalesNumberDto = {
  mailOrderSalesNumber: string;
  mailOrderSalesImage: File | null;
  mailOrderSalesImageName: string | null;
};

export type BusinessRegistrationFormDto = BusinessRegistrationDto &
  BusinessRegistrationImageDto &
  MailOrderSalesNumberDto;

interface BusinessRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: SettlementInfoRefetchType;
}

// 사업자 등록증 등록 다이얼로그
export function BusinessRegistrationDialog(
  props: BusinessRegistrationDialogProps,
): JSX.Element {
  const { isOpen, onClose, refetch } = props;
  const inputRef = useRef(null);
  const { data: profileData } = useProfile();
  const toast = useToast();
  const mutation = useBusinessRegistrationMutation();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue: setvalue,
    setError: seterror,
    reset,
    clearErrors,
  } = useForm<BusinessRegistrationFormDto>();

  function useClose(): void {
    onClose();
    reset();
  }

  async function regist(data: BusinessRegistrationFormDto): Promise<void> {
    const {
      businessRegistrationImage,
      businessRegistrationImageName,
      mailOrderSalesImage,
      mailOrderSalesImageName,
      companyName,
    } = data;

    try {
      // 사업자 등록증 S3 업로드
      const savedBusinessRegistrationImageName = await s3.s3UploadImage({
        filename: businessRegistrationImageName,
        file: businessRegistrationImage,
        type: 'business-registration',
        userMail: profileData?.email,
        companyName,
      });

      const savedMailOrderSalesImageName = await s3.s3UploadImage({
        filename: mailOrderSalesImageName,
        file: mailOrderSalesImage,
        type: 'mail-order',
        userMail: profileData?.email,
        companyName,
      });

      // 통신판매업 신고증의 경우, 선택이기 때문에 파일은 존재하나, 이미지 저장후의 이름이 존재하지 않는경우에만 에러
      if (
        !savedBusinessRegistrationImageName ||
        (mailOrderSalesImageName && !savedMailOrderSalesImageName)
      ) {
        throw new Error('S3 ERROR');
      }

      // 사업자 등록증 및 통신판매업 신고증 컬럼에 값 추가
      await mutation.mutateAsync({
        ...data,
        businessRegistrationImageName: savedBusinessRegistrationImageName,
        mailOrderSalesImageName: savedMailOrderSalesImageName
          ? mailOrderSalesImageName
          : '',
      });

      toast({
        title: '사업자 등록정보 등록 완료',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '이미지 등록 불가',
        description: '이미지 등록이 완료되지 않았습니다. 다른 이미지를 등록해주세요',
        status: 'error',
      });
    } finally {
      refetch();
      onClose();
      reset();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
      onClose={useClose}
      closeOnEsc={false}
      initialFocusRef={inputRef}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(regist)}>
        <ModalHeader>사업자 등록정보 등록</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BusinessRegistrationForm
            ref={inputRef}
            register={register}
            errors={errors}
            seterror={seterror}
            setvalue={setvalue}
            clearErrors={clearErrors}
          />
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isSubmitting}>
            등록하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
