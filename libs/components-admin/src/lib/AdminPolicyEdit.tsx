import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';
import { Policy } from '@prisma/client';
import { useAdminPolicy, useAdminPolicyUpdateMutation } from '@project-lc/hooks';
import { UpdatePolicyDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';

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

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생했습니다</Text>;
  if (!data) return <Text>데이터가 없습니다</Text>;
  return (
    <Box>
      <Button onClick={() => router.push('/general/policy')}>목록으로</Button>
      <EditForm data={data} />
    </Box>
  );
}

export default AdminPolicyEdit;

type EditFormData = Omit<Policy, 'enforcementDate' | 'publicFlag'> & {
  enforcementDate?: string;
  publicFlag: 'true' | 'false';
};

function EditForm({ data }: { data: Policy }): JSX.Element {
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
  } = useForm<EditFormData>({
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
  const onSubmitHandler = (d: EditFormData): void => {
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
        toast({ title: '수정 성공', status: 'success' });
      })
      .catch((e) => {
        console.error(e);
        toast({ title: `수정 실패 - ${e}`, status: 'error' });
      });
  };
  return (
    <Stack as="form" spacing={2} onSubmit={handleSubmit(onSubmitHandler)}>
      <Stack direction="row" alignItems="center">
        <Text>id : </Text>
        <Text>{data.id}</Text>
      </Stack>

      <FormControl id="verpublicFlagsion" isInvalid={!!errors.publicFlag}>
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
        setOptions={{
          height: '300px',
          buttonList: [
            [
              'font',
              'fontSize',
              'align',
              'list',
              'bold',
              'underline',
              'italic',
              'strike',
            ],
          ],
        }}
        defaultValue={watch('content')}
      />
      <Button type="submit" isLoading={updateRequest.isLoading}>
        수정
      </Button>
    </Stack>
  );
}
