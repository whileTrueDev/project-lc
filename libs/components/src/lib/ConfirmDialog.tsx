import {
  AlertDialogProps,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

export interface ConfirmDialogProps
  extends Omit<AlertDialogProps, 'leastDestructiveRef'> {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
  isLoading?: boolean;
  cancelString?: string;
  confirmString?: string;
}
export function ConfirmDialog({
  title,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  cancelString = '취소',
  confirmString = '확인',
  children,
}: ConfirmDialogProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isCentered
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogCloseButton isDisabled={isLoading} />
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button isLoading={isLoading} ref={cancelRef} onClick={onClose}>
              {cancelString}
            </Button>
            <Button
              ml={3}
              colorScheme="green"
              onClick={() => onConfirm().then(() => onClose())}
              isLoading={isLoading}
            >
              {confirmString}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
