import {
  Button,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { UserType } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { SunEditorWrapper, useSunEditorRef } from '@project-lc/components-core/SunEditor';
import { EditManualDto, PostManualDto } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';

export type ManualFormData = PostManualDto;

export function AdminManualForm({
  title,
  defaultValues,
  onConfirm,
  isProcessing,
}: {
  title?: string;
  defaultValues: ManualFormData;
  onConfirm: (data: ManualFormData) => Promise<void>;
  isProcessing?: boolean;
}): JSX.Element {
  const methods = useForm<ManualFormData>({
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

  const handleConfirm = async (): Promise<void> => {
    const data = getValues();
    onConfirm(data).then(() => {
      onClose();
    });
  };

  return (
    <FormProvider {...methods}>
      {title && <Heading mb={4}>{title}</Heading>}

      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <ManualInputLayout label="이용안내 대상">
          <Select {...register('target', { required: true })}>
            <option value={UserType.seller}>판매자 이용안내</option>
            <option value={UserType.broadcaster}>방송인 이용안내</option>
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
        <Button type="submit" isLoading={isProcessing}>
          저장하기
        </Button>
      </Stack>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="이용안내 입력한 내용 확인"
        onConfirm={handleConfirm}
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

export default AdminManualForm;

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
