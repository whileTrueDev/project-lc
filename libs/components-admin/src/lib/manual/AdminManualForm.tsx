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
import { AdminManualEditorSetOptions } from '@project-lc/components-constants/adminManualEditorSetOptions';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { SunEditorWrapper, useSunEditorRef } from '@project-lc/components-core/SunEditor';
import { useManualMainCategories } from '@project-lc/hooks';
import { PostManualDto } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import { FormProvider, useForm } from 'react-hook-form';

// 에디터에 이미지 표시하기 전 이용안내에 포함된 이미지 s3에 저장 -> s3에 저장된 url을 표시
const onImageUploadBefore = (
  files: File[],
  info: object,
  // eslint-disable-next-line @typescript-eslint/ban-types
  uploadHandler: Function,
): void => {
  Promise.all(
    files.map(async (file) => {
      const { objectUrl } = await s3.sendPutObjectCommand({
        Key: `manual/${file.name}_${new Date().getTime()}`,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
      });
      return {
        url: objectUrl,
        name: file.name,
        size: file.size,
      };
    }),
  )
    .then((data) => {
      const response = {
        result: data,
      };
      uploadHandler(response);
    })
    .catch((error) => {
      // insertBefore 에러 발생
      console.error(error);
    });
};

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
  const { register, getValues, setValue, watch } = methods;
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

  const { linkPages, mainCategories } = useManualMainCategories(watch('target'));

  return (
    <FormProvider {...methods}>
      {title && <Heading mb={4}>{title}</Heading>}

      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack direction={{ base: 'column', sm: 'row' }} width="100%">
          <ManualInputLayout label="이용안내 대상">
            <Select {...register('target', { required: true })}>
              <option value={UserType.seller}>판매자</option>
              <option value={UserType.broadcaster}>방송인</option>
            </Select>
          </ManualInputLayout>
          <ManualInputLayout label="대분류">
            <Select {...register('mainCategory', { required: true })}>
              {mainCategories.map((cat) => {
                return (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                );
              })}
            </Select>
          </ManualInputLayout>
          <ManualInputLayout label="순서">
            <Input
              placeholder="예: 1"
              type="number"
              {...register('order', { valueAsNumber: true })}
            />
          </ManualInputLayout>
        </Stack>

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

        <ManualInputLayout label="해당 이용안내 연결 페이지">
          <Select {...register('linkPageRouterPath')}>
            <option value="">없음</option>
            {linkPages.map((nav) => {
              return (
                <option key={nav.href} value={nav.href}>
                  {nav.name} {nav.href}
                </option>
              );
            })}
          </Select>
        </ManualInputLayout>

        <SunEditorWrapper
          sunEditorRef={sunEditorRef}
          onImageUploadBefore={onImageUploadBefore}
          // onPaste={handlePaste}
          setOptions={AdminManualEditorSetOptions}
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
        <Text>
          대분류 :
          {mainCategories.find((item) => item.key === getValues('mainCategory'))?.label}
        </Text>
        <Text>제목 : {getValues('title')}</Text>
        <Text>간략설명 : {getValues('description')}</Text>
        <Text>순서 : {getValues('order')}</Text>
        {getValues('linkPageRouterPath') && (
          <Text>
            연결 페이지 :
            {
              linkPages.find((item) => item.href === getValues('linkPageRouterPath'))
                ?.name
            }
            {
              linkPages.find((item) => item.href === getValues('linkPageRouterPath'))
                ?.href
            }
          </Text>
        )}

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
