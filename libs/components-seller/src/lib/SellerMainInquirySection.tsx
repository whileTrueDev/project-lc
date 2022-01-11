import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { KkshowTogether } from '@project-lc/components-shared/KkshowTogether';
import { InquiryForm } from '@project-lc/components-shared/InquiryForm';

export function SellerMainInquirySection(): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <KkshowTogether
        buttons={[
          { label: '시작하기', onClick: () => router.push('/login') },
          { label: '문의하기', onClick: onOpen },
        ]}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {/*
             // TODO: 문의사항 다이얼로그 디자인 적용 
             // TODO: 문의하기 성공 콜백 onClose전달할 수  있도록 수정필요
            */}
            <InquiryForm type="seller" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SellerMainInquirySection;
