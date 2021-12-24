import { EmailIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
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
  Textarea,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import {
  useAdminCreateMultipleNotification,
  useAdminCreateNotification,
} from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
import { QuickSearchInput, QuickSearchInputProps } from '../QuickSearchInput';
import AdminNotificationBroadcasterList from './AdminNotificationBroadcasterList';
import AdminNotificationSellerList from './AdminNotificationSellerList';

export type AdminSendNotificationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  targetUsersEmailList: string[];
  userType: UserType;
  targetDisplay: JSX.Element;
};

export type NotificationMessage = {
  title: string;
  content: string;
};

export function AdminSendNotificationDialog({
  isOpen,
  onClose,
  userType,
  targetUsersEmailList,
  targetDisplay,
}: AdminSendNotificationDialogProps): JSX.Element {
  const formMethods = useForm<NotificationMessage>();

  const toast = useToast();
  const [confirmed, { on, off }] = useBoolean();
  const createOneNotification = useAdminCreateNotification();
  const createMultipleNotification = useAdminCreateMultipleNotification();

  const handleClose = (): void => {
    onClose();
    off();
    formMethods.reset();
  };

  const onSubmit = async (data: NotificationMessage): Promise<void> => {
    if (!confirmed) return;

    const handleSuccess = (res: any): void => {
      toast({ title: '메시지 전송 성공', status: 'success' });
      handleClose();
    };

    const handleError = (error: any): void => {
      console.error(error);
      toast({ title: '메시지 전송 실패', status: 'error' });
    };

    // 대상 유저 1명인 경우
    if (targetUsersEmailList.length === 1) {
      const email = targetUsersEmailList[0];
      await createOneNotification
        .mutateAsync({ userEmail: email, userType, ...data })
        .then(handleSuccess)
        .catch(handleError);
      return;
    }
    // 대상 유저 여러명인 경우
    await createMultipleNotification
      .mutateAsync({ userEmailList: targetUsersEmailList, userType, ...data })
      .then(handleSuccess)
      .catch(handleError);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior="inside">
      <ModalOverlay />
      <FormProvider {...formMethods}>
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ModalHeader>메시지 보내기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {targetDisplay}

            <Text>제목 </Text>
            <Input {...formMethods.register('title', { required: true })} />
            <Text>메시지 (최대 400자)</Text>
            <Textarea
              resize="none"
              maxLength={400}
              {...formMethods.register('content', { required: true })}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            {confirmed ? (
              <Box>
                <Text color="red">
                  유저에게 전송한 메시지는 취소할 수 없습니다.
                  <br />
                  받는사람과 제목, 메시지 내용을 다시 한번 확인해주세요. <br />
                  진짜로 전송하시겠습니까?
                </Text>
                <Button type="submit" mr={1} colorScheme="red">
                  진짜로 보내기
                </Button>
                <Button onClick={off}>취소</Button>
              </Box>
            ) : (
              <Button onClick={on}>보내기</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export interface UserSearchToolbarProps extends QuickSearchInputProps {
  onButtonClick?: () => void;
  isButtonDisabled?: boolean;
}

/** 검색창, 메시지보내기 버튼 있는 툴바 */
export function UserSearhToolbar({
  clearSearch,
  onChange,
  value,
  onButtonClick,
  isButtonDisabled,
}: UserSearchToolbarProps): JSX.Element {
  return (
    <Flex direction="row" justifyContent="space-between" mb={1}>
      <QuickSearchInput
        maxW={400}
        mr={1}
        clearSearch={clearSearch}
        onChange={onChange}
        value={value}
      />
      <Button
        leftIcon={<EmailIcon />}
        onClick={onButtonClick}
        isDisabled={isButtonDisabled}
      >
        메시지 보내기
      </Button>
    </Flex>
  );
}

export function AdminNotificationSection(): JSX.Element {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
      <AdminNotificationSellerList />
      <AdminNotificationBroadcasterList />
    </Stack>
  );
}

export default AdminNotificationSection;
