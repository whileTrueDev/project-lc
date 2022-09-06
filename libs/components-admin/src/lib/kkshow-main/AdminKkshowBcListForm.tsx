import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
  useToast,
} from '@chakra-ui/react';
import { Broadcaster } from '@prisma/client';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { useAdminBroadcasters, useAdminKkshowBcListMutation } from '@project-lc/hooks';
import { CreateKkshowBcListDto } from '@project-lc/shared-types';
import { SubmitHandler, useForm } from 'react-hook-form';

interface KkshowBcListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export function KkshowBcListCreateDialog({
  isOpen,
  onClose,
}: KkshowBcListCreateDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>크크쇼 방송인 목록 - 방송인 등록</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <KkshowBcListForm onCancel={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface KkshowBcListFormProps {
  onCancel: () => void;
}
export function KkshowBcListForm({ onCancel }: KkshowBcListFormProps): JSX.Element {
  const toast = useToast();
  const createBcList = useAdminKkshowBcListMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateKkshowBcListDto>();
  const onSubmit: SubmitHandler<CreateKkshowBcListDto> = async (data) => {
    return createBcList
      .mutateAsync(data)
      .then(() => {
        toast({ title: '방송인 등록 성공', status: 'success' });
        onCancel();
      })
      .catch((err) => {
        toast({
          title: '방송인 등록 실패',
          status: 'error',
          description: err.response?.data?.message,
        });
      });
  };

  const { data: broadcasters } = useAdminBroadcasters();
  const onBroadcasterSelect = (bc: Broadcaster | null): void => {
    if (bc) {
      setValue('nickname', bc.userNickname || '');
      setValue('profileImage', bc.avatar || '');
      setValue('broadcasterId', bc.id);
    } else {
      setValue('nickname', '');
      setValue('profileImage', '');
      setValue('broadcasterId', undefined);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Box>
          <ChakraAutoComplete
            options={broadcasters || []}
            getOptionLabel={(a) => `[ID:${a?.id}] ${a?.userNickname}`}
            label="가입된 방송인 정보 불러오기"
            onChange={onBroadcasterSelect}
          />
          <Text fontSize="xs" color="GrayText">
            가입된 방송인 정보를 토대로 아래 정보를 채우고자 한다면 여기서 선택해주세요.
          </Text>
        </Box>

        <Divider />

        <FormControl isInvalid={!!errors.nickname}>
          <FormLabel>닉네임</FormLabel>
          <Input
            {...register('nickname', { required: '닉네임을 입력해주세요.' })}
            placeholder="크크TV"
          />
          <FormErrorMessage>{errors.nickname?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.profileImage}>
          <FormLabel>프로필이미지URL</FormLabel>
          <Input
            {...register('profileImage', { required: '프로필이미지URL을 입력해주세요.' })}
            placeholder="https://some-url.example"
          />
          <FormErrorMessage>{errors.profileImage?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.href}>
          <FormLabel>링크</FormLabel>
          <Input
            {...register('href', { required: '링크를 입력해주세요.' })}
            placeholder="/bc/1"
          />
          <FormHelperText fontSize="xs">{`방송인 홍보페이지링크를 연결하고자 한다면 "/bc/<고유ID번호> 와 같이 작성하면 됩니다.`}</FormHelperText>
          <FormErrorMessage>{errors.href?.message}</FormErrorMessage>
        </FormControl>
      </Stack>

      <Box mt={4} textAlign="right">
        <ButtonGroup>
          <Button colorScheme="blue" type="submit">
            등록
          </Button>
          <Button onClick={onCancel}>닫기</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

export default KkshowBcListForm;
