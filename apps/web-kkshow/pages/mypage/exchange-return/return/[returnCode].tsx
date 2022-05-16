import { Stack, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';

export function ReturnDetailPage(): JSX.Element {
  const router = useRouter();
  const { returnCode } = router.query;
  return (
    <CustomerMypageLayout>
      <Stack>
        <Text>반품코드 : {returnCode}</Text>
      </Stack>
    </CustomerMypageLayout>
  );
}

export default ReturnDetailPage;
