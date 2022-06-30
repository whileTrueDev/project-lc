import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useToast,
  Box,
  useColorModeValue,
  ButtonGroup,
} from '@chakra-ui/react';
import { useCustomerDeleteMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';

type CustomerDeleteConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};

export function CustomerDeleteConfirmationDialog(
  props: CustomerDeleteConfirmationDialogProps,
): JSX.Element {
  const { isOpen, onClose, userId } = props;
  const toast = useToast();
  const router = useRouter();
  const { mutateAsync } = useCustomerDeleteMutation(userId);

  const handleDelete = (): void => {
    mutateAsync(userId)
      .then(() => {
        toast({ title: '탈퇴 완료', status: 'success' });
        router.push('/');
      })
      .catch(() => {
        toast({
          title: '탈퇴중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
          status: 'error',
        });
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 탈퇴</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            bgColor={useColorModeValue('red.100', 'red.400')}
            fontSize="sm"
            p={3}
            rounded="md"
            textAlign="center"
          >
            <Text>탈퇴 이후 모든 데이터가 삭제되며 복구가 불가능합니다.</Text>
            <Text>정말로 탈퇴하시겠습니까?</Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme="blue" onClick={handleDelete}>
              탈퇴
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
