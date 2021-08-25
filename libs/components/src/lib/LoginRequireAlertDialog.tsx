import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
  Icon,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import router from 'next/router';
import React from 'react';

export interface LoginRequireAlertDialogProps {
  isOpen: boolean;
  isCentered?: boolean;
}
export function LoginRequireAlertDialog(
  props: LoginRequireAlertDialogProps,
): JSX.Element {
  const { onClose } = useDisclosure();
  const { isOpen, isCentered = true } = props;
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isCentered={isCentered}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <Text>
              <Icon as={WarningTwoIcon} color="red.500" mr={2} />
              로그인이 필요합니다
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody>로그인 화면으로 이동합니다</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={() => router.push('/login')} ml={3}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default LoginRequireAlertDialog;
