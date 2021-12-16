import {
  MypageLayout,
  broadcasterCenterMypageNavLinks,
  StartGuideSection,
} from '@project-lc/components';
import { useDisclosure, Button } from '@chakra-ui/react';

export function Index(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      마이페이지 홈<Button onClick={onOpen}>클릭</Button>
      <StartGuideSection isOpen={isOpen} onClose={onClose} />
    </MypageLayout>
  );
}

export default Index;
