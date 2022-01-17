import { useDisclosure } from '@chakra-ui/react';
import { InquiryDialog } from '@project-lc/components-shared/InquiryForm';
import { KkshowTogether } from '@project-lc/components-shared/KkshowTogether';
import { useRouter } from 'next/router';

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

      <InquiryDialog isOpen={isOpen} onClose={onClose} type="seller" />
    </>
  );
}

export default SellerMainInquirySection;
