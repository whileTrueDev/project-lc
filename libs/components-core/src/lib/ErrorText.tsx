import { Text } from '@chakra-ui/layout';

export function ErrorText({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Text fontSize="xs" color="red.500">
      {children}
    </Text>
  );
}
