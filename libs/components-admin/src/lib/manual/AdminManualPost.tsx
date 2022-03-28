import { Button, Stack, useToast } from '@chakra-ui/react';
import { useAdminManualPostMutation } from '@project-lc/hooks';
import { PostManualDto } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import AdminManualForm from './AdminManualForm';

const defaultValues: PostManualDto = {
  target: 'seller', // seller | broadcaster
  title: '', // 이용안내 주제(예: 상품 등록, 라이브커머스 등록)
  description: '', // 주제에 대한 짧은 설명 (예: 크크쇼에 상품을 등록하는 방법입니다.)
  order: 1, // 이용안내 표시될 순서
  contents: 'asdf', // 이용안내 내용
};
export function AdminManualPost(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const moveToList = (): void => {
    router.push('/general/manual');
  };
  const handleSuccess = (): void => {
    toast({ title: '이용안내 작성 완료', status: 'success' });
    router.push('/general/manual');
  };
  const handleError = (e: any): void => {
    console.error(e);
    toast({ title: `이용안내 실패 - ${e}`, status: 'error' });
  };
  const postManual = useAdminManualPostMutation();
  const onConfirm = async (dto: PostManualDto): Promise<void> => {
    postManual.mutateAsync(dto).then(handleSuccess).catch(handleError);
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={moveToList}>목록으로 돌아가기</Button>
      </Stack>
      <AdminManualForm
        title="이용안내 작성페이지"
        defaultValues={defaultValues}
        onConfirm={onConfirm}
      />
    </Stack>
  );
}

export default AdminManualPost;
