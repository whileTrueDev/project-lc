import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import {
  useAdminBroadcaster,
  useAdminBroadcasterPromotionPageCreateMutation,
} from '@project-lc/hooks';
import { BroadcasterPromotionPageDto } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

export interface BroadcasterPromotionPageFormDto
  extends Omit<BroadcasterPromotionPageDto, 'broadcasterId'> {
  broadcasterId: number | null;
}
export function AdminBroadcasterPromotionPageForm({
  onSubmitHandler,
  onCancel,
  defaultValues = { comment: '', broadcasterId: undefined },
}: {
  onSubmitHandler: SubmitHandler<BroadcasterPromotionPageFormDto>;
  onCancel: () => void;
  defaultValues?: Partial<BroadcasterPromotionPageFormDto>;
}): JSX.Element {
  const { handleSubmit, setValue, watch, register } =
    useForm<BroadcasterPromotionPageFormDto>({ defaultValues });

  /** 방송인 중 상품홍보페이지가 등록되지 않은 방송인만 표시 */
  const { data: broadcasters, isLoading } = useAdminBroadcaster();
  const validBroadcasters = useMemo(() => {
    if (!broadcasters) return [];
    return broadcasters.filter((b) => !b.BroadcasterPromotionPage);
  }, [broadcasters]);

  if (isLoading) return <Text>로딩중...</Text>;
  if (validBroadcasters.length === 0) {
    return <Text>상품홍보페이지를 등록할 수 있는 방송인이 없습니다.</Text>;
  }

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <FormControl>
        <FormLabel>방송인</FormLabel>
        <ChakraAutoComplete
          options={validBroadcasters}
          getOptionLabel={(option) =>
            option?.userNickname || option?.email || option?.id.toString() || ''
          }
          onChange={(newV) => {
            if (newV) {
              setValue('broadcasterId', newV.id);
            } else {
              setValue('broadcasterId', null);
            }
          }}
        />
        <FormHelperText>
          상품홍보페이지가 아직 생성되지 않은 방송인만 표시됩니다.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>알림말(선택)</FormLabel>
        <Textarea
          {...register('comment')}
          placeholder="방송인페이지에 프로필 섹션에 표시되는 알림말을 작성할 수 있습니다.(작성하지않아도 됩니다) 팁: 소개글에 이모지를활용하면 더 깔끔해보입니다."
        />
      </FormControl>

      <Box textAlign="right" pt={4}>
        <ButtonGroup>
          <Button colorScheme="blue" type="submit" disabled={!watch('broadcasterId')}>
            생성
          </Button>
          <Button onClick={onCancel}>닫기</Button>
        </ButtonGroup>
      </Box>
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
  const onSubmit: SubmitHandler<BroadcasterPromotionPageFormDto> = async (data) => {
    const { broadcasterId, comment } = data;
    if (!broadcasterId) return;

    createPageUrl.mutateAsync({ broadcasterId, comment }).then(() => {
      toast({ title: '방송인 상품홍보페이지를 등록하였습니다', status: 'success' });
      queryClient.invalidateQueries('getBroadcaster');
      onClose();
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>방송인 상품 홍보 페이지 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AdminBroadcasterPromotionPageForm
            onSubmitHandler={onSubmit}
            onCancel={onClose}
          />
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
