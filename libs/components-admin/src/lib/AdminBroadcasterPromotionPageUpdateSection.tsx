import {
  useDisclosure,
  Box,
  Button,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import {
  getAdminDuplicatePromotionPageFlag,
  useAdminBroadcasterPromotionPageUpdateMutation,
} from '@project-lc/hooks';
import { BroadcasterPromotionPageData } from '@project-lc/shared-types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BroadcasterPromotionPageFormDataType } from './AdminBroadcasterPromotionPageCreateSection';

export function AdminBroadcasterPromotionPageUpdateModal({
  isOpen,
  onClose,
  pageData,
}: {
  isOpen: boolean;
  onClose: () => void;
  pageData: BroadcasterPromotionPageData;
  defaultValues?: BroadcasterPromotionPageFormDataType;
}): JSX.Element {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BroadcasterPromotionPageFormDataType>({
    defaultValues: {
      id: pageData.id,
      broadcasterId: pageData.broadcasterId,
      url: pageData.url || '',
    },
  });

  const updateRequest = useAdminBroadcasterPromotionPageUpdateMutation();

  const onSubmit: SubmitHandler<BroadcasterPromotionPageFormDataType> = (data) => {
    if (!data.id) return;
    updateRequest
      .mutateAsync({
        id: data.id,
        broadcasterId: data.broadcasterId || undefined,
        url: data.url,
      })
      .then((res) => {
        toast({ title: '상품홍보페이지 url을 수정하였습니다', status: 'success' });
        onClose();
      })
      .catch((error) => {
        toast({ title: `에러가 발생했습니다 ${error}`, status: 'error' });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>방송인 상품 홍보 페이지 url 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.url}>
              <FormLabel htmlFor="url">url</FormLabel>
              <Input
                id="url"
                placeholder="https://k-kmarket.com/goods/catalog?code=00160001"
                autoComplete="off"
                {...register('url', {
                  required: 'url을 작성해주세요.',
                  validate: async (_url) => {
                    const isDuplicateUrl = await getAdminDuplicatePromotionPageFlag(_url);
                    return (
                      !isDuplicateUrl || '이미 등록된 url 입니다. 다시 확인해주세요.'
                    );
                  },
                })}
              />
              <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button type="submit" colorScheme="blue" disabled={!watch('url')}>
                수정
              </Button>
              <Button onClick={onClose}>닫기</Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export interface AdminBroadcasterPromotionPageUpdateSectionProps {
  pageData: BroadcasterPromotionPageData;
}
export function AdminBroadcasterPromotionPageUpdateSection({
  pageData,
}: AdminBroadcasterPromotionPageUpdateSectionProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button onClick={onOpen} size="xs">
        수정
      </Button>
      <AdminBroadcasterPromotionPageUpdateModal
        isOpen={isOpen}
        onClose={onClose}
        pageData={pageData}
      />
    </Box>
  );
}

export default AdminBroadcasterPromotionPageUpdateSection;
