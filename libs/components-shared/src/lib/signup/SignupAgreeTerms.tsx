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
  termsOfService: boolean;
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
  const { data: termsOfService } = usePolicy({
    category: 'termsOfService',
    targetUser: userType,
  });

  const { handleSubmit, register, watch } = useForm<AgreeTermsData>({
    defaultValues: { privacyPolicy: false, termsOfService: false },
  });

  const onSubmit = (_data: AgreeTermsData): void => {
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
          justifyContent="center"
          spacing={6}
        >
          <Stack>
            <HtmlStringBox
              maxHeight={120}
              {...boxStyle}
              mb={1}
              overflowY="auto"
              fontSize="sm"
              htmlString={privacyTerm?.content || ''}
            />
            <Checkbox {...register('privacyPolicy', { required: true })}>
              <Text as="span" size="xs" color="blue.500">
                (필수){' '}
              </Text>
              크크쇼 개인정보 처리방침에 동의합니다.
            </Checkbox>
            <HtmlStringBox
              maxHeight={120}
              {...boxStyle}
              mb={1}
              overflowY="auto"
              fontSize="sm"
              htmlString={termsOfService?.content || ''}
            />
            <Checkbox {...register('termsOfService', { required: true })}>
              <Text as="span" size="xs" color="blue.500">
                (필수){' '}
              </Text>
              크크쇼 이용약관에 동의합니다.
            </Checkbox>{' '}
          </Stack>

          <Stack>
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
        </Stack>
      )}
    </CenterBox>
  );
}

export default SignupAgreeTerms;
