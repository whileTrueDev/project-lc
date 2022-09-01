import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  useAdminBroadcasters,
  useAdminKkshowBcListDeleteMutation,
  useAdminKkshowBcListMutation,
  useKkshowBcList,
} from '@project-lc/hooks';
import NextLink from 'next/link';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateKkshowBcListDto } from '@project-lc/shared-types';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { Broadcaster, KkshowBcList } from '@prisma/client';
import { getKkshowWebHost } from '@project-lc/utils';
import { useMemo } from 'react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';

export function KkshowBcListPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Text fontWeight="bold" fontSize="lg">
        크크쇼 방송인 목록 관리
      </Text>
      <KkshowBcListManage />
    </AdminPageLayout>
  );
}

export default KkshowBcListPage;

function KkshowBcListManage(): JSX.Element | null {
  const { data: broadcasters, isLoading } = useKkshowBcList();
  const createDialog = useDisclosure();
  if (isLoading) return <Spinner />;
  if (!broadcasters) return null;
  return (
    <Stack spacing={1} justify="start" align="start">
      <Box my={2}>
        <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={createDialog.onOpen}>
          새 방송인 등록
        </Button>
        <KkshowBcListCreateDialog
          isOpen={createDialog.isOpen}
          onClose={createDialog.onClose}
        />
      </Box>
      {/* 현재 등록된 목록 */}
      {broadcasters.map((bc) => (
        <KkshowBcListBroadcaster key={bc.id} {...bc} />
      ))}
    </Stack>
  );
}
type KkshowBcListBroadcasterProps = KkshowBcList;
function KkshowBcListBroadcaster(bc: KkshowBcListBroadcasterProps): JSX.Element {
  const toast = useToast();
  const dialog = useDisclosure();
  const href = useMemo(() => {
    return bc.href.includes('http')
      ? bc.href
      : `${getKkshowWebHost()}${bc.href.startsWith('/') ? bc.href : `/${bc.href}`}`;
  }, [bc.href]);

  const { mutateAsync: deleteBc } = useAdminKkshowBcListDeleteMutation();
  const onRemoveClick = async (): Promise<void> => {
    return deleteBc({ id: bc.id })
      .then(() => {
        toast({ title: '방송인 목록에서 제거 성공', status: 'success' });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '방송인 목록에서 제거 실패',
          description: err.response?.data?.message,
          status: 'error',
        });
      });
  };

  return (
    <Flex key={bc.id} gap={2} align="center">
      <Avatar src={bc.profileImage} />
      <Text fontWeight="bold">{bc.nickname}</Text>
      <NextLink href={href} passHref>
        <Link isExternal>{href}</Link>
      </NextLink>
      <IconButton
        size="xs"
        aria-label="delete-bc-list"
        icon={<DeleteIcon />}
        onClick={dialog.onOpen}
      />
      <ConfirmDialog
        title={`${bc.nickname} 방송인을 목록에서 제거`}
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        onConfirm={onRemoveClick}
      >
        {bc.nickname} 방송인을 목록에서 제거하시겠습니까?
      </ConfirmDialog>
    </Flex>
  );
}

interface KkshowBcListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
function KkshowBcListCreateDialog({
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
function KkshowBcListForm({ onCancel }: KkshowBcListFormProps): JSX.Element {
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
  const onBroadcasterSelect = (bc: Broadcaster): void => {
    if (bc) {
      setValue('nickname', bc.userNickname);
      setValue('profileImage', bc.avatar);
    } else {
      setValue('nickname', '');
      setValue('profileImage', '');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Box>
          <ChakraAutoComplete
            options={broadcasters}
            getOptionLabel={(a) => `[ID:${a.id}] ${a.userNickname}`}
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
