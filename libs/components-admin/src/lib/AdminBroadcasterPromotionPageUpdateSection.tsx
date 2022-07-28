import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  getAdminDuplicatePromotionPageFlag,
  useAdminBroadcasterPromotionPageUpdateMutation,
} from '@project-lc/hooks';
import {
  BroadcasterPromotionPageData,
  BroadcasterPromotionPageUpdateDto,
} from '@project-lc/shared-types';
import { SubmitHandler, useForm } from 'react-hook-form';

export function AdminBroadcasterPromotionPageUpdateModal({
  isOpen,
  onClose,
  pageData,
}: {
  isOpen: boolean;
  onClose: () => void;
  pageData: BroadcasterPromotionPageData;
  defaultValues?: BroadcasterPromotionPageUpdateDto;
}): JSX.Element {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BroadcasterPromotionPageUpdateDto>({
    defaultValues: {
      id: pageData.id,
      broadcasterId: pageData.broadcasterId,
      url: pageData.url || '',
      comment: pageData.comment || '',
    },
  });

  const updateRequest = useAdminBroadcasterPromotionPageUpdateMutation();

  const onSubmit: SubmitHandler<BroadcasterPromotionPageUpdateDto> = (data) => {
    if (!data.id) return;
    updateRequest
      .mutateAsync({
        id: data.id,
        broadcasterId: data.broadcasterId || undefined,
        url: data.url,
        comment: data.comment,
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>방송인 상품홍보페이지 정보 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!errors.url}>
              <FormLabel fontWeight="bold" htmlFor="url">
                방송인 홍보페이지 URL
              </FormLabel>
              <Input
                id="url"
                placeholder="https://www.xn--hp4b17xa.com/bc/방송인고유ID"
                autoComplete="off"
                {...register('url', {
                  required: 'url을 작성해주세요.',
                  validate: async (_url) => {
                    if (!_url) return 'URL을 입력해주세요';
                    if (_url === pageData.url) return true;
                    const isDuplicateUrl = await getAdminDuplicatePromotionPageFlag(_url);
                    return (
                      !isDuplicateUrl || '이미 등록된 url 입니다. 다시 확인해주세요.'
                    );
                  },
                })}
              />
              <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
              <FormHelperText>
                크크쇼 방송인 페이지URL입니다. 대부분의 경우 기본적으로 올바른 페이지가
                자동생성되도록 구현되어 있습니다. 부득이하게 수정이 필요한 경우에만 작업을
                진행하시기 바랍니다.
              </FormHelperText>
              <FormHelperText>
                올바른URL형식:{' '}
                <Text color="red.500" as="span">
                  https://www.xn--hp4b17xa.com/bc/방송인고유ID
                </Text>
              </FormHelperText>
            </FormControl>

            <FormControl isInvalid={!!errors.comment}>
              <FormLabel fontWeight="bold">방송인 소개글</FormLabel>
              <Textarea {...register('comment')} />
              <FormHelperText>띄어쓰기, 문단나눔등이 모두 적용됩니다.</FormHelperText>
              <FormHelperText>tip: 이모지를 활용하면 더 깔끔해보입니다.</FormHelperText>
              <FormErrorMessage>{!!errors.comment?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              type="submit"
              colorScheme="blue"
              disabled={!isDirty}
              isLoading={isSubmitting || updateRequest.isLoading}
            >
              수정
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface AdminBroadcasterPromotionPageUpdateSectionProps extends ButtonProps {
  pageData: BroadcasterPromotionPageData;
}
export function AdminBroadcasterPromotionPageUpdateSection({
  pageData,
  ...rest
}: AdminBroadcasterPromotionPageUpdateSectionProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button leftIcon={<EditIcon />} onClick={onOpen} {...rest}>
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
