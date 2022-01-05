import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { AdminAccountList } from '@project-lc/components-admin/AdminAccountList';
import { AdminBroadcasterSettlementInfoList } from '@project-lc/components-admin/AdminBroadcasterSettlementInfoList';
import { AdminBusinessRegistrationList } from '@project-lc/components-admin/AdminBusinessRegistrationList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useAdminSettlementInfo } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function Index(): JSX.Element {
  const router = useRouter();
  const { data: settlementData } = useAdminSettlementInfo();

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Box px={7} py={4} textAlign="right">
            <Button
              onClick={() => {
                router.push('/settlement');
              }}
              colorScheme="blue"
            >
              정산진행하러가기
            </Button>
          </Box>

          <Heading>판매자</Heading>

          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 계좌 정보
            </Text>
            <AdminAccountList
              sellerSettlementAccount={settlementData?.sellerSettlementAccount}
            />
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 사업자 등록 정보
            </Text>
            <AdminBusinessRegistrationList
              sellerBusinessRegistrations={settlementData?.sellerBusinessRegistration}
            />
          </Box>

          <Heading mt={4}>방송인</Heading>

          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              방송인 정산정보 검수
            </Text>
            <AdminBroadcasterSettlementInfoList />
          </Box>
        </Box>
      </Box>
    </AdminPageLayout>
  );
}

export default Index;
