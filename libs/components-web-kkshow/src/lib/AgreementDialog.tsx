import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from '@chakra-ui/react';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { usePolicy, useCustomerInfoMutation, useProfile } from '@project-lc/hooks';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';

type AgreementDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AgreementDialog(props: AgreementDialogProps): JSX.Element {
  const { isOpen, onClose } = props;
  const toast = useToast();
  const { data: profile } = useProfile();
  const { mutateAsync } = useCustomerInfoMutation(profile?.id || 0);
  const { data: privacyTerm } = usePolicy({
    category: 'privacy',
    targetUser: 'customer',
  });

  const onSubmit = (): void => {
    mutateAsync({ agreementFlag: true })
      .then(() => {
        toast({ title: '동의 완료', status: 'success' });
        onClose();
      })
      .catch(() => {
        toast({
          title: '약관 동의 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status: 'error',
        });
      });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>개인정보이용동의</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HtmlStringBox
              maxHeight={120}
              {...boxStyle}
              mb={1}
              overflowY="auto"
              fontSize="sm"
              htmlString={privacyTerm?.content || ''}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              닫기
            </Button>
            <Button colorScheme="blue" onClick={onSubmit}>
              동의
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AgreementDialog;
