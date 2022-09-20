import { Button } from '@chakra-ui/button';

export function AdminTabAlarmResetButton({
  onClick,
}: {
  onClick: () => Promise<void> | void;
}): JSX.Element {
  return (
    <Button colorScheme="red" onClick={onClick}>
      알림 초기화
    </Button>
  );
}

export default AdminTabAlarmResetButton;
