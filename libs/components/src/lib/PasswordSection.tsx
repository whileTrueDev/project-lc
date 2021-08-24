import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Text,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import PasswordChangeForm from './PasswordChangeForm';
import PasswordCheckForm from './PasswordCheckForm';
import SettingSectionLayout from './SettingSectionLayout';

export function PasswordSection(): JSX.Element {
  const { data } = useProfile();
  const [pwCheckFlag, setPwCheckFlag] = useBoolean();
  const [pwChangeflag, setPwChangeFlag] = useBoolean();

  const hasPassword = data?.hasPassword;
  return (
    <SettingSectionLayout title="비밀번호">
      <>
        {hasPassword ? (
          <Button width="200px" onClick={setPwCheckFlag.toggle}>
            비밀번호 변경하기
          </Button>
        ) : (
          <>
            <Text>비밀번호가 등록되어 있지 않습니다. </Text>
            <Text>
              이메일과 비밀번호로 로그인을 하기 위해서는 비밀번호를 등록해주세요.
            </Text>
            <Button width="200px">비밀번호 등록하기</Button>
          </>
        )}
        {pwCheckFlag && (
          <Box boxShadow="xs" p="4" rounded="md">
            <PasswordCheckForm
              onCancel={setPwCheckFlag.off}
              onConfirm={() => {
                setPwCheckFlag.off();
                setPwChangeFlag.on();
              }}
            />
          </Box>
        )}
        {pwChangeflag && (
          <Box boxShadow="xs" p="4" rounded="md">
            <PasswordChangeForm />
          </Box>
        )}
      </>
    </SettingSectionLayout>
  );
}

export default PasswordSection;
