import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import {
  getAdminDuplicatePromotionPageFlag,
  useAdminBroadcaster,
  useAdminBroadcasterPromotionPageCreateMutation,
} from '@project-lc/hooks';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

export type BroadcasterPromotionPageFormDataType = {
  url: string;
  broadcasterId: number | null;
  id?: number | null;
};

export function AdminBroadcasterPromotionPageForm({
  onSubmitHandler,
  defaultValues = { url: '', broadcasterId: null },
}: {
  onSubmitHandler: SubmitHandler<BroadcasterPromotionPageFormDataType>;
  defaultValues?: BroadcasterPromotionPageFormDataType;
}): JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BroadcasterPromotionPageFormDataType>({
    defaultValues,
  });

  /** 방송인 중 상품홍보페이지가 등록되지 않은 방송인만 표시 */
  const { data: broadcasters } = useAdminBroadcaster();
  const validBroadcasters = useMemo(() => {
    if (!broadcasters) return [];
    return broadcasters.filter((b) => !b.BroadcasterPromotionPage);
  }, [broadcasters]);

  if (validBroadcasters.length === 0) {
    return <Text>상품홍보페이지를 등록할 수 있는 방송인이 없습니다.</Text>;
  }

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Box>
        <Text>방송인</Text>
        <ChakraAutoComplete
          options={validBroadcasters}
          getOptionLabel={(option) => option?.userNickname || ''}
          onChange={(newV) => {
            if (newV) {
              setValue('broadcasterId', newV.id);
            } else {
              setValue('broadcasterId', null);
            }
          }}
        />
      </Box>

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
              return !isDuplicateUrl || '이미 등록된 url 입니다. 다시 확인해주세요.';
            },
          })}
        />
        <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" disabled={!watch('url') || !watch('broadcasterId')}>
        생성
      </Button>
    </Stack>
  );
}

export function AdminBroadcasterPromotionPageCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const toast = useToast();
  const createPageUrl = useAdminBroadcasterPromotionPageCreateMutation();
  const queryClient = useQueryClient();
  const onSubmit: SubmitHandler<BroadcasterPromotionPageFormDataType> = async (data) => {
    const { broadcasterId, url } = data;
    if (!url || !broadcasterId) return;

    createPageUrl.mutateAsync({ url, broadcasterId }).then((res) => {
      toast({ title: '방송인 상품홍보페이지를 등록하였습니다', status: 'success' });
      queryClient.invalidateQueries('getBroadcaster');
      onClose();
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>방송인 상품 홍보 페이지 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AdminBroadcasterPromotionPageForm onSubmitHandler={onSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function AdminBroadcasterPromotionPageCreateSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button onClick={onOpen}>생성</Button>
      <AdminBroadcasterPromotionPageCreateModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default AdminBroadcasterPromotionPageCreateSection;
