import { Button, Checkbox, Spinner, Stack, Text } from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import CenterBox from '@project-lc/components-layout/CenterBox';
import { usePolicy } from '@project-lc/hooks';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SignupProcessItemProps } from './SignupStart';

type AgreeTermsData = {
  privacyPolicy: boolean;
};

export type SignupAgreeTermsProps = SignupProcessItemProps;
export function SignupAgreeTerms({
  userType, // userType에 따라 다른 개인정보 처리방침을 표시해야 할 때 사용
  moveToNext,
  moveToPrev,
}: SignupAgreeTermsProps): JSX.Element {
  const { data: privacyTerm, isLoading } = usePolicy({
    category: 'privacy',
    targetUser: userType,
  });
  const { handleSubmit, register, watch } = useForm<AgreeTermsData>({
    defaultValues: { privacyPolicy: false },
  });

  const onSubmit = (data: AgreeTermsData): void => {
    if (!moveToNext) return;
    moveToNext();
  };

  const watchAll: AgreeTermsData = watch();

  const everyChecked = useMemo(() => {
    const keys = Object.keys(watchAll) as Array<keyof AgreeTermsData>;
    return keys.every((key) => watchAll[key] === true);
  }, [watchAll]);

  return (
    <CenterBox enableShadow header={{ title: '크크쇼 시작하기', desc: '' }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          py={4}
          spacing={4}
          justifyContent="center"
        >
          <Checkbox {...register('privacyPolicy', { required: true })}>
            크크쇼 개인정보 이용처리 방침에 동의합니다.
            <Text as="span" size="xs" color="blue.500">
              (필수)
            </Text>
          </Checkbox>
          <HtmlStringBox
            maxHeight={120}
            {...boxStyle}
            mb={1}
            overflowY="auto"
            fontSize="sm"
            htmlString={privacyTerm?.content || ''}
          />

          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            type="submit"
            isDisabled={!everyChecked}
          >
            다음으로
          </Button>

          <Button onClick={moveToPrev}>돌아가기</Button>
        </Stack>
      )}
    </CenterBox>
  );
}

export default SignupAgreeTerms;
