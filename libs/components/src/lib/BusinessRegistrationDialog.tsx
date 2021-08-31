import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  Button,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BusinessRegistrationDto } from '@project-lc/shared-types';
import { BusinessRegistrationForm } from './BusinessRegistrationForm';
// 등록 정보UI와 동일한 형태를 사용

// 사업자 등록증 등록 다이얼로그
export function BusinessRegistrationDialog(props) {
  // 다이얼로그의 열린상태
  const { isOpen, onClose } = props;

  // react-hook-form추가
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
    setError,
    watch,
    reset,
  } = useForm<
    BusinessRegistrationDto & { businessRegistrationImage: string | ArrayBuffer | null }
  >();

  function useClose() {
    onClose();
    reset();
  }

  // onClose를 랩핑하여 모든 데이터를 초기화 수행
  // 다이얼로그의 열렸을때 focus
  const inputRef = useRef(null);

  // 등록을 수행하는 함수
  function regist(data: BusinessRegistrationDto) {
    // mutation을 수행하여 서버로 전달하자.
    // reset();
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
            setError={setError}
            setValue={setValue}
          />
        </ModalBody>
        <ModalFooter>
          <Button type="submit">등록하기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
