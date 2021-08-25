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
  Stack,
  List,
  UnorderedList,
  ListItem,
  Box,
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
        console.error(error);
        if (error.response.status === 400 || error.response.status === 401) {
          toast({
            title: '탈퇴 오류',
            description: error.response.data.message,
            status: 'error',
          });
        } else {
          toast({
            title: '탈퇴 오류',
            status: 'error',
          });
        }
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(deleteAccount)}>
        <ModalHeader>회원 탈퇴를 진행하시겠습니까?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* //TODO: 추후 문구 수정 */}
          <UnorderedList spacing={2}>
            <ListItem>
              <Text>
                회원 탈퇴 시 해당 계정에 다시 로그인 할 수 없으며,{' '}
                <Text as="span" color="red.500" fontWeight="bold">
                  판매 대금을 포함한 모든 정보가 삭제
                </Text>
                됩니다.
              </Text>
            </ListItem>
            <ListItem>
              연결된 소셜 계정이 있다면{' '}
              <Text as="span" color="orange.500" fontWeight="bold">
                소셜 계정 연결 해제
              </Text>
              를 먼저 진행해주세요.
            </ListItem>
            <ListItem>
              <Text mb={2}>계속 진행하려면 로그인한 계정의 이메일을 입력해주세요</Text>
            </ListItem>
          </UnorderedList>
          <Box mt={6}>
            <Input
              placeholder="탈퇴를 진행하려면 이메일을 입력하세요."
              {...register('email', { required: true })}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={closeModal}>
            취소
          </Button>
          <Button
            colorScheme="red"
            type="submit"
            disabled={!watch('email') || !data || (data && data.email !== watch('email'))}
          >
            회원 탈퇴
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccountRemoveDialog;
