import {
  Alert,
  Stack,
  HStack,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export function SettingNeedAlertBox({
  title,
  text,
}: {
  title?: string;
  text: React.ReactNode;
}): JSX.Element {
  return (
    <Alert status="warning">
      <Stack>
        <HStack spacing={0}>
          <AlertIcon />
          <AlertTitle>{title || '입력이 필요합니다!'}</AlertTitle>
        </HStack>
        <AlertDescription>{text}</AlertDescription>
      </Stack>
    </Alert>
  );
}
