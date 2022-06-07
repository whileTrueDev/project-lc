import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { ExportDetailActions } from '@project-lc/components-seller/ExportDetailActions';
import { ExportDetailItems } from '@project-lc/components-seller/ExportDetailItems';
import { ExportDetailSummary } from '@project-lc/components-seller/ExportDetailSummary';
import { ExportDetailTitle } from '@project-lc/components-seller/ExportDetailTitle';
import { OrderDetailDeliveryInfo } from '@project-lc/components-seller/OrderDetailDeliveryInfo';
import { useFmExport } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';
import { OrderDetailLoading } from '@project-lc/components-shared/order/OrderDetailLoading';

export default function ExportsDetail(): JSX.Element {
  const router = useRouter();
  const id = router.query.id as string;

  const exp = useFmExport(id);

  if (exp.isLoading) {
    return (
      <MypageLayout>
        <OrderDetailLoading />
      </MypageLayout>
    );
  }

  if (!exp.isLoading && !exp.data)
    return (
      <MypageLayout>
        <Box m="auto" maxW="4xl">
          <Stack spacing={2}>
            <Center>
              <Text>출고 데이터를 불러오지 못했습니다.</Text>
            </Center>
            <Center>
              <Text>없는 출고이거나 올바르지 못한 출고번호입니다.</Text>
            </Center>
            <Center>
              <Button onClick={() => router.push('/mypage/orders')}>돌아가기</Button>
            </Center>
          </Stack>
        </Box>
      </MypageLayout>
    );

  return (
    <MypageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2}>
        <Box as="section">
          <ExportDetailTitle exportData={exp.data} />
        </Box>

        <Box as="section">
          <ExportDetailActions exportData={exp.data} />
        </Box>

        <Box as="section">
          <ExportDetailSummary exportData={exp.data} />
        </Box>

        <SectionWithTitle title="출고 주문 정보">
          <Stack mt={6} spacing={4}>
            <ExportDetailItems exportData={exp.data} />
            <OrderDetailDeliveryInfo orderDeliveryData={exp.data} />
          </Stack>
        </SectionWithTitle>
      </Stack>
    </MypageLayout>
  );
}
