import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import router from 'next/router';
import React from 'react';

export interface LoginRequireAlertDialogProps {
  isOpen: boolean;
}
export function LoginRequireAlertDialog(
  props: LoginRequireAlertDialogProps,
): JSX.Element {
  const { onClose } = useDisclosure();
  const { isOpen } = props;
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            로그인이 필요합니다
          </AlertDialogHeader>

          <AlertDialogBody>메인페이지로 이동합니다</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={() => router.push('/')} ml={3}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default LoginRequireAlertDialog;
