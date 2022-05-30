import { Box, Radio, RadioGroup, HStack, useToast } from '@chakra-ui/react';
import { useCustomerInfoMutation } from '@project-lc/hooks';
import { Gender } from '@prisma/client';

export function GenderSelection(props: { gender: string; userId: number }): JSX.Element {
  const { gender, userId } = props;

  const toast = useToast();

  const { mutateAsync } = useCustomerInfoMutation(userId);

  const handleRadio = (value: Gender): void => {
    mutateAsync({ gender: value })
      .then(() => {
        toast({
          title: '성별 변경이 완료되었습니다',
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          title: '성별 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요/',
          status: 'error',
        });
      });
  };

  return (
    <Box>
      <RadioGroup value={gender} onChange={(value) => handleRadio(value as Gender)}>
        <HStack>
          <Radio value="male">남</Radio>
          <Radio value="female">여</Radio>
        </HStack>
      </RadioGroup>
    </Box>
  );
}

export default GenderSelection;
