import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { CustomerDeleteConfirmationDialog } from './CustomerDeleteConfirmationDialog';

export function CustomerDelete(props: { userId: number }): JSX.Element {
  const { userId } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Box>
      <Button variant="ghost" size="xs">
        <Text fontWeight="thin" onClick={onOpen}>
          회원탈퇴
        </Text>
      </Button>
      <CustomerDeleteConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        userId={userId}
      />
    </Box>
  );
}

export default CustomerDelete;
