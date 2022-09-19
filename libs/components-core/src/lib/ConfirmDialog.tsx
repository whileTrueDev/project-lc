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
  onFail?: (e?: any) => Promise<any>;
  isLoading?: boolean;
  cancelString?: string;
  confirmString?: string;
  isDisabled?: boolean;
}
export function ConfirmDialog({
  title,
  isOpen,
  onClose,
  onConfirm,
  onFail,
  isLoading,
  cancelString = '취소',
  confirmString = '확인',
  isDisabled = false,
  children,
}: ConfirmDialogProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const handleConfirmClick = async (): Promise<void> => {
    return onConfirm()
      .then(() => onClose())
      .catch((err) => {
        if (onFail) return onFail(err);
        return console.log(err);
      });
  };
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
            <Button ref={cancelRef} onClick={onClose}>
              {cancelString}
            </Button>
            <Button
              ml={3}
              colorScheme="green"
              onClick={handleConfirmClick}
              isLoading={isLoading}
              isDisabled={isDisabled}
            >
              {confirmString}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
