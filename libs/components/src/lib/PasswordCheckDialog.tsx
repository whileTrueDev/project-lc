import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import PasswordCheckForm from './PasswordCheckForm';
import SettingSectionLayout from './SettingSectionLayout';

export type DialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  headerText?: string;
  onConfirm: () => void;
};

export function PasswordCheckDialog(props: DialogProps): JSX.Element {
  const { isOpen, onClose, headerText, onConfirm } = props;
  const { data: profileData } = useProfile();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {headerText && <ModalHeader>{headerText}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <SettingSectionLayout title="비밀번호 확인">
            <Text>
              회원님의 계정 설정을 변경하기 전 본인확인을 위해 비밀번호를 입력해주세요.
            </Text>
            <PasswordCheckForm
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

export default PasswordCheckDialog;
