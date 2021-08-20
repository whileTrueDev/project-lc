import { Button, Heading, Text, useDisclosure, VStack } from '@chakra-ui/react';
import AccountRemoveDialog from './AccountRemoveDialog';

export function AccountRemoveSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onRemove = () => console.log('delete');
  return (
    <VStack spacing={4} alignItems="flex-start" padding={2}>
      <Heading as="h6" size="md">
        회원 탈퇴
      </Heading>
      <Text>탈퇴하시면 더 이상 project-lc에 로그인 할 수 없습니다.</Text>
      <Button width="200px" onClick={onOpen}>
        회원 탈퇴
      </Button>
      <AccountRemoveDialog isOpen={isOpen} onClose={onClose} onRemove={onRemove} />
    </VStack>
  );
}

export default AccountRemoveSection;
