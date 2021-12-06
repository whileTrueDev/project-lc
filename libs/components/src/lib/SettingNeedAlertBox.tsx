import {
  Alert,
  Stack,
  HStack,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export function SettingNeedAlertBox({ text }: { text: React.ReactNode }): JSX.Element {
  return (
    <Alert status="warning">
      <Stack>
        <HStack spacing={0}>
          <AlertIcon />
          <AlertTitle>입력이 필요합니다!</AlertTitle>
        </HStack>
        <AlertDescription>{text}</AlertDescription>
      </Stack>
    </Alert>
  );
}
