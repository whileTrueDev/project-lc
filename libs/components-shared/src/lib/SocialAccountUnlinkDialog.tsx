import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';

export type SocialAccountUnlinkDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  headerText?: string;
  hasPassword: boolean;
  unlinkHandler: () => void;
};

export function SocialAccountUnlinkDialog(
  props: SocialAccountUnlinkDialogProps,
): JSX.Element {
  const { isOpen, onClose, hasPassword, unlinkHandler, headerText } = props;

  // 다음에 로그인시 이메일과 비밀번호 사용해야 함 알림
  // 1. 비밀번호 있는 경우 : 연동해제버튼
  // 2. 비밀번호 없는 경우 : 현재 비밀번호 등록되어있지 않음. 비밀번호 등록 요청문구

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {headerText && <ModalHeader>{headerText}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>
            소셜 계정 연결을 해제한 이후 로그인 하실 때는 이메일 주소와 비밀번호를
            입력해야 합니다.
          </Text>
          {!hasPassword && (
            <Alert status="warning">
              <AlertIcon />
              <AlertDescription>
                현재 비밀번호가 등록되어 있지 않습니다. 계정 연결을 해제하기 전에
                비밀번호를 먼저 등록해주세요
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="red" onClick={unlinkHandler} disabled={!hasPassword}>
            연동해제
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SocialAccountUnlinkDialog;
