import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import PasswordChangeForm from './PasswordChangeForm';

export type DialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  headerText?: string;
  onConfirm: () => void;
};

export function PasswordChangeDialog(props: DialogProps): JSX.Element {
  const { isOpen, onClose, headerText, onConfirm } = props;
  const { data: profileData } = useProfile();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {headerText && <ModalHeader>{headerText}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <PasswordChangeForm
              email={profileData?.email}
              onCancel={onClose}
              onConfirm={onConfirm}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme="blue" type="submit" form="password-change-form">
              비밀번호 변경
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PasswordChangeDialog;
