import { Box, Heading, Stack, Textarea } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export function LiveShoppingRequestInput(): JSX.Element {
  const { register } = useFormContext<{ requests: string }>();

  return (
    <Box w="100%" mt="10">
      <Stack spacing={2}>
        <Heading as="h6" size="xs">
          요청사항
        </Heading>
        <Textarea
          placeholder={`[예시]

          - 조리 과정이 꼼꼼하게 담겼으면 합니다.
          - 야외 라이브 커머스로 진행되었으면 합니다.
          - 다양한 레시피로 활용할 수 있다는 점을 강조해주세요.
          - 3만원이상 구매시 배송비 무료 이벤트
          - 인터넷 최저가라는 점을 강조해 주세요.`}
          width={600}
          height={300}
          maxLength={500}
          resize="none"
          {...register('requests')}
        />
      </Stack>
    </Box>
  );
}

export default LiveShoppingRequestInput;
