import {
  Button,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { PostManualDto } from '@project-lc/shared-types';
import { useForm, FormProvider } from 'react-hook-form';
import { SunEditorWrapper, useSunEditorRef } from '@project-lc/components-core/SunEditor';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useAdminManualPostMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function ManualInputLayout({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}): JSX.Element {
  return (
    <Stack direction="row">
      <Text width="100px">{label}</Text>
      {children}
    </Stack>
  );
}

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
  const methods = useForm<PostManualDto>({
    defaultValues,
  });
  const { register, getValues, setValue } = methods;
  const sunEditorRef = useSunEditorRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onSubmit = (): void => {
    if (!sunEditorRef.current) return;
    setValue('contents', sunEditorRef.current.getContents(false));
    onOpen();
  };

  const handleSuccess = (): void => {
    toast({ title: '이용안내 작성 완료', status: 'success' });
    onClose();
    router.push('/general/manual');
  };
  const handleError = (e: any): void => {
    console.error(e);
    toast({ title: `이용안내 실패 - ${e}`, status: 'error' });
  };
  const postManual = useAdminManualPostMutation();
  const onConfirm = async (): Promise<void> => {
    const dto = getValues();
    postManual.mutateAsync(dto).then(handleSuccess).catch(handleError);
  };

  return (
    <FormProvider {...methods}>
      <Heading mb={4}>이용안내 작성페이지</Heading>
      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <ManualInputLayout label="이용안내 대상">
          <Select {...register('target', { required: true })}>
            <option value="seller">판매자 이용안내</option>
            <option value=" brodcaster">방송인 이용안내</option>
          </Select>
        </ManualInputLayout>

        <ManualInputLayout label="순서">
          <Input
            placeholder="예: 1"
            type="number"
            {...register('order', { valueAsNumber: true })}
          />
        </ManualInputLayout>

        <ManualInputLayout label="주제">
          <Input
            placeholder="예: 상품 등록, 라이브커머스 등록"
            {...register('title', { required: true })}
          />
        </ManualInputLayout>

        <ManualInputLayout label="간략 설명">
          <Input
            placeholder="예: 크크쇼에 상품을 등록하는 방법입니다."
            {...register('description', { required: true })}
          />
        </ManualInputLayout>

        <SunEditorWrapper
          sunEditorRef={sunEditorRef}
          setOptions={{
            height: '300px',
          }}
          defaultValue={getValues('contents')}
        />
        <Button type="submit" isLoading={postManual.isLoading}>
          작성하기
        </Button>
      </Stack>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="이용안내 입력한 내용 확인"
        onConfirm={onConfirm}
      >
        <Text>이용안내 대상 : {getValues('target')}</Text>
        <Text>주제 : {getValues('title')}</Text>
        <Text>간략설명 : {getValues('description')}</Text>
        <Text>순서 : {getValues('order')}</Text>
        <Text>맞으면 확인을 눌러주세요</Text>
      </ConfirmDialog>
    </FormProvider>
  );
}

export default AdminManualPost;
