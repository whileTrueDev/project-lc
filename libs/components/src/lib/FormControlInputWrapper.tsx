import { FormControl, Stack, Text } from '@chakra-ui/react';

export function FormControlInputWrapper({
  children,
  id,
  suffix,
}: {
  children: React.ReactNode;
  id?: string;
  suffix: string;
}) {
  return (
    <FormControl id={id}>
      <Stack>
        {children}
        <Stack direction="row" justifyContent="flex-end">
          <Text>{suffix}</Text>
        </Stack>
      </Stack>
    </FormControl>
  );
}

export default FormControlInputWrapper;
