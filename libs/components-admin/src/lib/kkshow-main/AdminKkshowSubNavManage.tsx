import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { KkshowSubNavLink } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useKkshowSubNav,
  useSubNavCreateMutation,
  useSubNavDeleteMutation,
} from '@project-lc/hooks';
import { CreateKkshowSubNavDto } from '@project-lc/shared-types';
import { SubmitHandler, useForm } from 'react-hook-form';

export function AdminKkshowSubNavManage(): JSX.Element {
  const { data: kkshowSubNavLinks } = useKkshowSubNav();
  const createDialog = useDisclosure();

  const colDefs: GridColumns = [
    { field: 'name', headerName: '링크명', width: 120 },
    { field: 'index', headerName: '순서(우선순위)', width: 160 },
    { field: 'link', headerName: '링크URL', flex: 1 },
    {
      field: '',
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }) => {
        return <AdminKkshowSubNavAction subnav={row as KkshowSubNavLink} />;
      },
    },
  ];
  return (
    <Box>
      <Text fontWeight="bold" fontSize="xl">
        subnav 관리
      </Text>

      <UnorderedList>
        <ListItem>
          SubNav란 크크쇼 모든 페이지의 상단 헤더의 아래에 표시되는 링크 모음입니다.
        </ListItem>
        <ListItem>
          SubNav에는 특정 카테고리 상품 페이지, 이벤트페이지, 특정상품페이지 등 유저를
          이동시킬 페이지 링크가 나열됩니다.
        </ListItem>
        <ListItem>
          순서는 실제 순서를 의미하지 않고, 우선순위를 의미합니다. 우선순위가 동일한 경우,
          이름을 기준으로 순서를 정합니다. (ㄱ,ㄴ,ㄷ 순)
        </ListItem>
        <ListItem color="blue.400">
          크크쇼 내부 페이지로 이동시키는 경우 /goods/1 과 같이 작성하여야 합니다. /를
          포함하여야 합니다.
        </ListItem>
        <ListItem color="blue.400">
          크크쇼 외부 페이지로 이동시키는 경우 URL을 정확히 작성하여야 합니다. (ex.
          https://naver.com)
        </ListItem>
        <ListItem color="red.400" fontWeight="bold">
          Subnav를 추가하거나 제거하는 작업은 곧바로 크크쇼의 모든 페이지에 반영되므로,
          신중히 작성해주세요.
        </ListItem>
      </UnorderedList>

      <Box mt={6}>
        <Text fontSize="lg" fontWeight="bold">
          Subnav 목록
        </Text>
        <Box py={1}>
          <Button leftIcon={<AddIcon />} size="sm" onClick={createDialog.onOpen}>
            새 링크 생성
          </Button>
          <AdminKkshowSubNavCreateDialog
            isOpen={createDialog.isOpen}
            onClose={createDialog.onClose}
          />
        </Box>

        <Box minH={400}>
          <ChakraDataGrid autoHeight columns={colDefs} rows={kkshowSubNavLinks || []} />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminKkshowSubNavManage;

export type AdminKkshowSubNavCreateDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'>;
export function AdminKkshowSubNavCreateDialog({
  isOpen,
  onClose,
}: AdminKkshowSubNavCreateDialogProps): JSX.Element {
  const toast = useToast();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<CreateKkshowSubNavDto>();

  const { mutateAsync: createSubNav } = useSubNavCreateMutation();
  const onSuccess = (): void => {
    toast({ title: `sub 내비링크 생성 완료`, status: 'success' });
    onClose();
    reset();
  };
  const onFail = (err: any): void => {
    console.error(err);
    toast({
      title: 'sub 내비링크 생성 실패',
      status: 'error',
      description: err.response?.data?.message,
    });
  };
  const onSubmit: SubmitHandler<CreateKkshowSubNavDto> = (formData) => {
    return createSubNav(formData).then(onSuccess).catch(onFail);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          Subnav 생성
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>링크명*</FormLabel>
              <Input
                {...register('name', { required: '입력해주세요.' })}
                placeholder="밀키트"
                autoComplete="off"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.index}>
              <FormLabel>우선순위*</FormLabel>
              <Input
                {...register('index', { required: '입력해주세요.' })}
                placeholder="1"
                type="number"
                autoComplete="off"
              />
              <FormErrorMessage>{errors.index?.message}</FormErrorMessage>
              <FormHelperText fontSize="xs">
                순서는 실제 순서를 의미하지 않고, 우선순위를 의미합니다. 우선순위가 동일한
                경우, 이름을 기준으로 순서를 정합니다. (ㄱ,ㄴ,ㄷ 순)
              </FormHelperText>
            </FormControl>

            <FormControl isInvalid={!!errors.link}>
              <FormLabel>링크URL*</FormLabel>
              <Input
                {...register('link', { required: '입력해주세요.' })}
                placeholder="/shopping/category/2V-aFdOt039f(caetegoryCode)"
                autoComplete="off"
              />
              <FormErrorMessage>{errors.link?.message}</FormErrorMessage>
              <FormHelperText fontSize="xs">
                - 크크쇼 내부 페이지로 이동시키는 경우 /goods/1 과 같이 작성하여야 합니다.
                /를 포함하여야 합니다.
              </FormHelperText>
              <FormHelperText fontSize="xs">
                - 크크쇼 외부 페이지로 이동시키는 경우 URL을 정확히 작성하여야 합니다.
                (ex. https://naver.com)
              </FormHelperText>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              생성
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface AdminKkshowSubNavActionProps {
  subnav: KkshowSubNavLink;
}
export function AdminKkshowSubNavAction({
  subnav,
}: AdminKkshowSubNavActionProps): JSX.Element {
  const toast = useToast();
  const deleteDialog = useDisclosure();
  const { mutateAsync: deleteSubNav } = useSubNavDeleteMutation();
  const handleDelete = async (): Promise<void> => {
    deleteSubNav(subnav.id)
      .then(() => {
        toast({ title: 'subnav 링크 삭제 완료', status: 'success' });
        deleteDialog.onClose();
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: 'subnav 링크 삭제 실패',
          status: 'error',
          description: err.response?.data?.message,
        });
      });
  };

  return (
    <>
      <Button size="xs" leftIcon={<DeleteIcon />} onClick={deleteDialog.onOpen}>
        삭제
      </Button>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        title={`${subnav.name} subnav링크를 삭제합니까?`}
        onConfirm={handleDelete}
      >
        <Text>링크를 삭제합니까?</Text>
      </ConfirmDialog>
    </>
  );
}
