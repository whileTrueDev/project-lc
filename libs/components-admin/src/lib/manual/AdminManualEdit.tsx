import { Button, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminManualDeleteMutation,
  useAdminManualEditMutation,
  useAdminManualList,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import AdminManualForm, { ManualFormData } from './AdminManualForm';

export interface AdminManualEditProps {
  id: number;
}
export function AdminManualEdit({ id }: AdminManualEditProps): JSX.Element {
  const toast = useToast();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, isError } = useAdminManualList();

  const moveToList = (): void => {
    router.push('/general/manual');
  };

  // 수정 핸들러
  const onEditSuccess = (): void => {
    toast({ title: '수정 성공', status: 'success' });
    moveToList();
  };
  const onEditError = (e: any): void => {
    toast({ title: `수정 실패 ${e}`, status: 'error' });
  };

  const { mutateAsync } = useAdminManualEditMutation();
  const onEditConfirm = async (formData: ManualFormData): Promise<void> => {
    mutateAsync({ ...formData, id })
      .then(onEditSuccess)
      .catch(onEditError);
  };

  // 삭제 핸들러
  const onDeleteSuccess = (): void => {
    toast({ title: '삭제 성공', status: 'success' });
    moveToList();
  };
  const onDeleteError = (e: any): void => {
    toast({ title: `삭제 실패 ${e}`, status: 'error' });
  };

  const deleteMutation = useAdminManualDeleteMutation();
  const onDeleteConfirm = async (): Promise<void> => {
    deleteMutation.mutateAsync(id).then(onDeleteSuccess).catch(onDeleteError);
  };

  if (isLoading) return <Text>로딩중...</Text>;
  if (isError) return <Text>에러가 발생했습니다</Text>;
  if (!data) return <Text>데이터가 없습니다</Text>;

  const manual = data.find((item) => item.id === id);
  if (!manual) return <Text>데이터가 없습니다 id: {id}</Text>;
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={moveToList}>목록으로 돌아가기</Button>
        <Button colorScheme="red" onClick={onOpen}>
          해당 이용안내 삭제하기
        </Button>
      </Stack>
      <AdminManualForm
        title="이용안내 수정페이지"
        defaultValues={manual}
        onConfirm={onEditConfirm}
      />
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title={`이용안내 삭제하기 ( id: ${id} )`}
        onConfirm={onDeleteConfirm}
      >
        <Text>정말로 삭제하시겠습니까? 삭제 후 데이터 복구가 불가능합니다</Text>
      </ConfirmDialog>
    </Stack>
  );
}

export default AdminManualEdit;
