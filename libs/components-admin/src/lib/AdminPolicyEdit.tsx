import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';
import { Policy } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminPolicy,
  useAdminPolicyDeleteMutation,
  useAdminPolicyUpdateMutation,
} from '@project-lc/hooks';
import {
  POLICY_CATEGORY,
  POLICY_TARGET_USER,
  UpdatePolicyDto,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { policyEditorOptions } from './AdminPolicyWrite';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <Center>
      <Spinner />
    </Center>
  ),
});
export interface AdminPolicyEditProps {
  id: number;
}
export function AdminPolicyEdit({ id }: AdminPolicyEditProps): JSX.Element {
  const router = useRouter();
  const { data, isLoading, isError } = useAdminPolicy(id);

  const toast = useToast();
  const goToList = useCallback(() => router.push('/general/policy'), [router]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteRequest = useAdminPolicyDeleteMutation(id);

  const onDelete = async (): Promise<void> => {
    deleteRequest
      .mutateAsync()
      .then((res) => {
        toast({ title: '삭제성공', status: 'success' });
        goToList();
      })
      .catch((error) => {
        toast({ title: `삭제실패 ${error}`, status: 'error' });
      });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생했습니다</Text>;
  if (!data) return <Text>데이터가 없습니다</Text>;
  return (
    <Stack>
      <Stack direction="row" justify="space-between">
        <Button onClick={goToList}>목록으로</Button>
        <Button colorScheme="red" onClick={onOpen}>
          데이터 삭제
        </Button>
      </Stack>

      <ConfirmDialog
        title="해당 데이터를 삭제하시겠습니까"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onDelete}
      >
        삭제시 복구가 불가능합니다
      </ConfirmDialog>

      <EditForm data={data} onEditSuccessHandler={goToList} />
    </Stack>
  );
}

export default AdminPolicyEdit;

export type PolicyFormData = Omit<Policy, 'enforcementDate' | 'publicFlag'> & {
  enforcementDate?: string;
  publicFlag: 'true' | 'false';
};

function EditForm({
  data,
  onEditSuccessHandler,
}: {
  data: Policy;
  onEditSuccessHandler?: () => void;
}): JSX.Element {
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore): void => {
    editor.current = sunEditor;
  };

  const {
    watch,
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm<PolicyFormData>({
    defaultValues: {
      ...data,
      publicFlag: data.publicFlag ? 'true' : 'false',
      enforcementDate: data.enforcementDate
        ? dayjs(data.enforcementDate).format('YYYY-MM-DD')
        : undefined,
    },
  });

  const toast = useToast();
  const updateRequest = useAdminPolicyUpdateMutation(data.id);
  const onSubmitHandler = (d: PolicyFormData): void => {
    if (!editor.current) return;

    const { enforcementDate, publicFlag, ...rest } = d;
    const text = editor.current.getContents(false);
    const dto: UpdatePolicyDto = {
      ...rest,
      publicFlag: publicFlag === 'true',
      enforcementDate: enforcementDate ? new Date(enforcementDate) : undefined,
      content: text,
    };
    updateRequest
      .mutateAsync(dto)
      .then((res) => {
        if (onEditSuccessHandler) onEditSuccessHandler();
        toast({ title: '수정 성공', status: 'success' });
      })
      .catch((e) => {
        console.error(e);
        toast({ title: `수정 실패 - ${e}`, status: 'error' });
      });
  };
  return (
    <Stack as="form" spacing={2} onSubmit={handleSubmit(onSubmitHandler)}>
      <Heading size="md">{`${POLICY_TARGET_USER[data.targetUser]} ${
        POLICY_CATEGORY[data.category]
      } 수정`}</Heading>
      <Stack direction="row" alignItems="center" fontWeight="bold">
        <Text>id : </Text>
        <Text>{data.id}</Text>
      </Stack>

      <FormControl id="publicFlag" isInvalid={!!errors.publicFlag}>
        <Stack direction="row" alignItems="center">
          <FormLabel width="60px">공개여부</FormLabel>
          <RadioGroup value={watch('publicFlag').toString()}>
            <HStack>
              <Radio key="true" {...register('publicFlag')} value="true">
                공개
              </Radio>
              <Radio key="false" {...register('publicFlag')} value="false">
                미공개
              </Radio>
            </HStack>
          </RadioGroup>
        </Stack>
        {errors.publicFlag && (
          <FormErrorMessage>{errors.publicFlag.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl id="version" isInvalid={!!errors.version}>
        <Stack direction="row" alignItems="center">
          <FormLabel width="50px">버전명</FormLabel>
          <Input
            maxLength={160}
            placeholder="버전명을 입력하세요"
            {...register('version', { required: true })}
          />
        </Stack>
        {errors.version && <FormErrorMessage>{errors.version.message}</FormErrorMessage>}
      </FormControl>

      <FormControl id="enforcementDate" isInvalid={!!errors.enforcementDate}>
        <Stack direction="row" alignItems="center">
          <FormLabel width="50px">시행일</FormLabel>
          <Controller
            name="enforcementDate"
            control={control}
            render={({ field }) => (
              <TextField {...field} id="enforcementDate" type="date" />
            )}
          />
        </Stack>
        {errors.version && <FormErrorMessage>{errors.version.message}</FormErrorMessage>}
      </FormControl>

      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        lang="ko"
        setOptions={policyEditorOptions}
        defaultValue={watch('content')}
      />
      <Button type="submit" isLoading={updateRequest.isLoading}>
        수정
      </Button>
    </Stack>
  );
}
