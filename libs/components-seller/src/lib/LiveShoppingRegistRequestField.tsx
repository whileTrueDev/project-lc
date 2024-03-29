import { WarningIcon } from '@chakra-ui/icons';
import { Box, Stack, Text, Textarea } from '@chakra-ui/react';
import { LiveShoppingInput } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

const examplePlaceholder = `[예시]

- 조리 과정이 꼼꼼하게 담겼으면 합니다.
- 야외 라이브 커머스로 진행되었으면 합니다.
- 다양한 레시피로 활용할 수 있다는 점을 강조해주세요.
- 3만원이상 구매시 배송비 무료 이벤트
- 인터넷 최저가라는 점을 강조해 주세요.`;
export function LiveShoppingRegistRequestField(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<LiveShoppingInput>();
  return (
    <Box w="100%">
      <Stack spacing={2}>
        <Stack direction="row">
          <Text as="h6" size="sm" fontWeight="bold">
            요청사항
          </Text>
          <Text fontSize="xs">(최대 500자)</Text>
        </Stack>
        <Textarea
          placeholder={examplePlaceholder}
          height={300}
          resize="none"
          size="sm"
          isInvalid={!!errors.requests}
          {...register('requests', {
            maxLength: { value: 500, message: '500자 이하로 작성해주세요.' },
          })}
        />
        {errors.requests && (
          <Text color="tomato">
            <WarningIcon /> {errors.requests.message}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

export default LiveShoppingRegistRequestField;
