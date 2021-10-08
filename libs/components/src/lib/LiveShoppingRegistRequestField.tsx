import { Box, Heading, Stack, Textarea } from '@chakra-ui/react';

export function LiveShoppingRequestInput(props: any): JSX.Element {
  const { handleRequestsInput } = props;

  return (
    <Box w="100%" mt="10">
      <Stack spacing={2}>
        <Heading as="h6" size="xs">
          요청사항
        </Heading>
        <Textarea
          placeholder="요청사항을 입력해주세요"
          width={600}
          height={300}
          maxLength={500}
          resize="none"
          onChange={handleRequestsInput}
        />
      </Stack>
    </Box>
  );
}

export default LiveShoppingRequestInput;
