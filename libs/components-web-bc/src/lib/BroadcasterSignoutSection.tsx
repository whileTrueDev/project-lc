import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import PasswordCheckDialog from '@project-lc/components-shared/PasswordCheckDialog';
import { useDeleteBroadcasterMutation, useLogout } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
};

export function BroadcasterSignoutSection(): JSX.Element {
  const passwordModal = useDisclosure();
  const signoutModal = useDisclosure();
  const { register, handleSubmit, watch } = useForm<FormData>();
  const toast = useToast();

  const { mutateAsync } = useDeleteBroadcasterMutation();
  const { logout } = useLogout();

  const deleteAccount = (data: FormData): void => {
    mutateAsync(data)
      .then((isDeleted) => {
        if (isDeleted) {
          toast({
            title: '계정이 삭제되었습니다. 메인페이지로 이동합니다',
            status: 'success',
          });
          logout(); // 로그아웃처리(queryClient.clear) 하고 메인으로 이동함
        }
      })
      .catch((error) => {
        toast({
          title: '탈퇴 오류',
          description: error.response?.data?.message,
          status: 'error',
        });
      });
  };
  return (
    <Box>
      <Button size="xs" variant="link" onClick={passwordModal.onOpen} fontWeight="thin">
        회원탈퇴
      </Button>
      <PasswordCheckDialog
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.onClose}
        onConfirm={() => {
          passwordModal.onClose();
          signoutModal.onOpen();
        }}
      />
      <Modal isOpen={signoutModal.isOpen} size="xl" onClose={signoutModal.onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(deleteAccount)}>
          <ModalHeader>회원 탈퇴를 진행하시겠습니까?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              <Stack spacing={3}>
                <Text>
                  회원 탈퇴 시 해당 계정에 다시 로그인 할 수 없으며,
                  <br /> 수익금을 포함한 모든 정보가 삭제됩니다.
                </Text>
                <Text>탈퇴 후 데이터 복구 및 되돌리기는 불가능합니다.</Text>
                <Text>정말로 탈퇴하시겠습니까?</Text>
              </Stack>
            </Alert>
            <Text my={2}>계속 진행하려면 로그인한 계정의 이메일을 입력해주세요</Text>
            <Input
              placeholder="탈퇴를 진행하려면 이메일을 입력하세요."
              {...register('email', { required: true })}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" isDisabled={!watch('email')}>
              탈퇴하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default BroadcasterSignoutSection;
