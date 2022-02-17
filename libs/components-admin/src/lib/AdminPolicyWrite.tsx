import {
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
  useToast,
} from '@chakra-ui/react';
import { TextField } from '@material-ui/core';
import { PolicyCategory, PolicyTarget } from '@prisma/client';
import { useAdminPolicyCreateMutation } from '@project-lc/hooks';
import {
  CreatePolicyDto,
  POLICY_CATEGORY,
  POLICY_TARGET_USER,
} from '@project-lc/shared-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SetOptions from 'suneditor-react/dist/types/SetOptions';
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

export interface AdminPolicyWriteProps {
  category: PolicyCategory;
  targetUser: PolicyTarget;
}
export function AdminPolicyWrite({
  category,
  targetUser,
}: AdminPolicyWriteProps): JSX.Element {
  return (
    <Stack>
      <Heading size="lg">{`${POLICY_TARGET_USER[targetUser]} ${POLICY_CATEGORY[category]} 작성하기`}</Heading>
      <WriteForm category={category} targetUser={targetUser} />
    </Stack>
  );
}

export default AdminPolicyWrite;

export const policyEditorOptions: SetOptions = {
  height: '300px',
  buttonList: [
    [
      'undo',
      'redo',
      'font',
      'fontSize',
      'formatBlock',
      'paragraphStyle',
      'align',
      'list',
      'bold',
      'underline',
      'italic',
      'strike',
    ],
  ],
};

type PolicyWriteFormData = Pick<
  CreatePolicyDto,
  'category' | 'targetUser' | 'version' | 'content'
> & {
  enforcementDate?: string;
  publicFlag: 'true' | 'false';
};
function WriteForm({ category, targetUser }: AdminPolicyWriteProps): JSX.Element {
  const router = useRouter();

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
  } = useForm<PolicyWriteFormData>({
    defaultValues: {
      category,
      targetUser,
      content: '',
      enforcementDate: undefined,
      version: '',
      publicFlag: 'false',
    },
  });

  const toast = useToast();
  const createRequest = useAdminPolicyCreateMutation();
  const onSubmitHandler = (d: PolicyWriteFormData): void => {
    if (!editor.current || !d.version || !d.enforcementDate) return;

    const text = editor.current.getContents(false);
    if (!text) {
      toast({ title: '내용을 작성해주세요', status: 'warning' });
      return;
    }

    const dto: CreatePolicyDto = {
      category,
      targetUser,
      content: text,
      publicFlag: d.publicFlag === 'true',
      enforcementDate: new Date(d.enforcementDate),
      version: d.version,
    };

    createRequest
      .mutateAsync(dto)
      .then((res) => {
        router.push('/general/policy');
        toast({ title: '작성 성공', status: 'success' });
      })
      .catch((e) => {
        toast({ title: `작성 실패 ${e}`, status: 'error' });
      });
  };
  return (
    <Stack as="form" spacing={2} onSubmit={handleSubmit(onSubmitHandler)}>
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
            {...register('version', { required: '버전명을 입력해주세요' })}
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
            rules={{ required: '시행일을 입력해주세요' }}
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
      <Button type="submit" isLoading={createRequest.isLoading}>
        작성
      </Button>
    </Stack>
  );
}
