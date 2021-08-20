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
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';

export type AccountRemoveDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  onRemove: () => void;
};

export function AccountRemoveDialog(props: AccountRemoveDialogProps): JSX.Element {
  const { isOpen, onClose, onRemove } = props;
  const { data } = useProfile();
  const { register, handleSubmit, watch, reset } = useForm();

  const closeModal = () => {
    reset();
    onClose();
  };
  const deleteAccount = () => {
    onRemove();
    closeModal();
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
          <Text>계속 진행하려면 이메일을 입력해주세요</Text>
          <Input {...register('email', { required: true })} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeModal}>
            취소
          </Button>
          <Button
            colorScheme="red"
            type="submit"
            disabled={!data || (data && data.sub !== watch('email'))}
          >
            회원 탈퇴
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccountRemoveDialog;
