import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
  Text,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useDeleteSellerMutation, useProfile } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';

export type AccountRemoveDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  /** remove 요청 성공 후 콜백 */
  onRemove: () => void;
};

export function AccountRemoveDialog(props: AccountRemoveDialogProps): JSX.Element {
  const { isOpen, onClose, onRemove } = props;
  const { data } = useProfile();
  const { register, handleSubmit, watch, reset, getValues } = useForm();
  const { mutateAsync } = useDeleteSellerMutation();
  const toast = useToast();

  const closeModal = () => {
    reset();
    onClose();
  };

  const deleteAccount = () => {
    mutateAsync(getValues('email'))
      .then((isDeleted) => {
        if (isDeleted) {
          onRemove();
          closeModal();
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: '탈퇴 오류',
            description: error.response.data.message,
            status: 'error',
          });
        }
        toast({
          title: '탈퇴 오류',
          status: 'error',
        });
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(deleteAccount)}>
        <ModalHeader>회원 탈퇴를 진행하시겠습니까?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>회원 탈퇴 시 모든 정보가 삭제됩니다!!!!! </Text>
          <Text>회원 탈퇴 시 모든 정보가 삭제됩니다!!!!! </Text>
          <Text>회원 탈퇴 시 모든 정보가 삭제됩니다!!!!! </Text>
          <Text mb={3}>회원 탈퇴 시 모든 정보가 삭제됩니다!!!!! </Text>
          <Text>해당 계정에 다시 로그인 할 수 없습니다.</Text>
          <Text>해당 계정에 다시 로그인 할 수 없습니다.</Text>
          <Text mb={3}>해당 계정에 다시 로그인 할 수 없습니다.</Text>
          <Text mb={3}>
            연결된 소셜 계정이 있다면 소셜 계정 연결 해제를 먼저 진행해주세요.
          </Text>
          <Text mb={2}>계속 진행하려면 로그인 한 계정의 이메일을 입력해주세요</Text>
          <Input {...register('email', { required: true })} />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={closeModal}>
            취소
          </Button>
          <Button
            colorScheme="red"
            type="submit"
            // disabled={!data || (data && data.sub !== watch('email'))}
          >
            회원 탈퇴
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccountRemoveDialog;
