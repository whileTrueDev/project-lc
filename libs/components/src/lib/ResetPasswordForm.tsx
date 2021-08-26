import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import CenterBox from './CenterBox';

const resetPasswordSteps = {
  1: {
    header: {
      title: '이메일 입력하기',
      desc: '본인 인증을 위해 해당 메일로 인증 코드를 발송합니다',
    },
  },
  2: {
    header: {
      title: '코드입력',
      desc: '메일로 발송된 코드를 입력해주세요',
    },
  },
  3: {
    header: {
      title: '비밀번호 재설정',
      desc: '새로운 비밀번호를 입력해주세요',
    },
  },
};
export function ResetPasswordForm(): JSX.Element {
  const [step, setStep] = useState<keyof typeof resetPasswordSteps>(1);
  return (
    <CenterBox enableShadow header={resetPasswordSteps[step].header}>
      <Box>비밀번호 변경화면 {step}</Box>
      <Button
        onClick={() =>
          setStep((prev) => {
            let next = prev + 1;
            if (next > 3) {
              next = prev;
            }
            return next as keyof typeof resetPasswordSteps;
          })
        }
      >
        +
      </Button>
      <Button
        onClick={() =>
          setStep((prev) => {
            let next = prev - 1;
            if (next < 1) {
              next = prev;
            }
            return next as keyof typeof resetPasswordSteps;
          })
        }
      >
        -
      </Button>
    </CenterBox>
  );
}

export default ResetPasswordForm;
