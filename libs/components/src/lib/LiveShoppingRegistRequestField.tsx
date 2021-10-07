import { useState } from 'react';
import { Box, Heading, Stack, Textarea } from '@chakra-ui/react';

export function LiveShoppingRequestInput(): JSX.Element {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleInputChange = (e: any): any => {
    const inputValue = e.target.value;
    if (inputValue.length >= 500) {
      setIsDisabled(true);
    }
  };
  return (
    <Box w="100%" mt="10">
      <Stack spacing={5}>
        <Heading as="h6" size="xs">
          요청사항
        </Heading>
      </Stack>
      <Textarea
        placeholder="요청사항을 입력해주세요"
        size="sm"
        resize="none"
        onChange={handleInputChange}
        disabled={isDisabled}
      />
    </Box>
  );
}

export default LiveShoppingRequestInput;
