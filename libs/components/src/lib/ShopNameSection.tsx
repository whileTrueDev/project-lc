import { Button, Flex, useDisclosure, Text } from '@chakra-ui/react';
import { ShopNameDialog } from '@project-lc/components';
import { useProfile } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';

// shop 이름 변경 섹션
export function ShopNameSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useProfile();

  return (
    <SettingSectionLayout title="상점명">
      <Text>구매자들에게 보여질 상점명을 변경하세요.</Text>
      <Flex alignItems="baseline">
        <Text fontSize="sm" mr={2}>
          현재 상점명 :
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="gray:500">
          {' '}
          {data?.shopName}
        </Text>
      </Flex>

      <Button width="200px" onClick={onOpen}>
        상점명 변경하기
      </Button>
      <ShopNameDialog isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </SettingSectionLayout>
  );
}
