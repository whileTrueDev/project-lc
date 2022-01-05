import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
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
          <SettingSectionLayout title="새 비밀번호">
            <Text>새로운 비밀번호를 입력해주세요</Text>
            <PasswordChangeForm
              email={profileData?.email}
              onCancel={onClose}
              onConfirm={onConfirm}
            />
          </SettingSectionLayout>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PasswordChangeDialog;
