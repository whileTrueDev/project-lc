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

export type BusinessRegistrationFormDto = BusinessRegistrationDto & {
  businessRegistrationImage: File | null;
  imageName: string | null;
};

interface BusinessRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: SettlementInfoRefetchType;
}

// 사업자 등록증 등록 다이얼로그
export function BusinessRegistrationDialog(props: BusinessRegistrationDialogProps) {
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

  function useClose() {
    onClose();
    reset();
  }

  // 또 다른 s3 업로드 과정이 필요할 때, hook으로 파일 분리
  async function saveToS3(data: BusinessRegistrationFormDto) {
    const { businessRegistrationImage, imageName, companyName, ...result } = data;
    // s3로 저장
    const savedImageName = await s3.s3UploadImage({
      filename: imageName,
      userMail: profileData?.email,
      type: 'business-registration',
      file: businessRegistrationImage,
      companyName,
    });

    if (!savedImageName) {
      throw new Error('S3 ERROR');
    }

    return savedImageName;
  }

  async function regist(data: BusinessRegistrationFormDto) {
    const { businessRegistrationImage, imageName, ...result } = data;

    try {
      const savedImageName = await saveToS3(data);
      await mutation.mutateAsync({ ...result, fileName: savedImageName });
      toast({
        title: '사업자 등록증 등록 완료',
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
      closeOnOverlayClick={false}
      closeOnEsc={false}
      initialFocusRef={inputRef}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(regist)}>
        <ModalHeader>사업자 등록증 등록</ModalHeader>
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
