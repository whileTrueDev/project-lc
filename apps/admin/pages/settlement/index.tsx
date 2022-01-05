import { Button, Center } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import router from 'next/router';

export function SettlementIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Center mt={40}>
        <Button
          mr={1}
          colorScheme="linkedin"
          h="100px"
          onClick={() => router.push('/settlement/seller')}
        >
          판매자 정산페이지로 이동
        </Button>
        <Button
          ml={1}
          colorScheme="teal"
          h="100px"
          onClick={() => router.push('/settlement/broadcaster')}
        >
          방송인 정산페이지로 이동
        </Button>
      </Center>
    </AdminPageLayout>
  );
}

export default SettlementIndex;
