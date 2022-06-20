import { Box, Button, Center, Link, Stack, Text } from '@chakra-ui/react';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { ExportDetailSummary } from '@project-lc/components-seller/ExportDetailSummary';
import { ExportDetailTitle } from '@project-lc/components-seller/ExportDetailTitle';
import { DeliveryTrackingList } from '@project-lc/components-shared/delivery-tracking/DeliveryTracking';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { OrderDetailLoading } from '@project-lc/components-shared/order/OrderDetailLoading';
import { useExportByCode } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export default function ExportsDetail(): JSX.Element {
  const router = useRouter();
  const exportCode = router.query.exportCode as string;
  const exp = useExportByCode(exportCode, { enabled: !!exportCode });

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
          <ExportDetailSummary exportData={exp.data} />
        </Box>

        <SectionWithTitle title="합포장 출고 정보">
          <Stack>
            {exp.data.bundleExports.map((bundle) => (
              <Box key={bundle.exportCode}>
                <NextLink passHref href={`/mypage/orders/exports/${bundle.exportCode}`}>
                  <Link color="blue.500" fontSize="sm">
                    {bundle.exportCode}
                  </Link>
                </NextLink>
              </Box>
            ))}
          </Stack>
        </SectionWithTitle>

        <SectionWithTitle title="출고 주문 정보">
          <Stack spacing={4}>
            <DeliveryTrackingList orderCode={exp.data.order.orderCode} />
          </Stack>
        </SectionWithTitle>
      </Stack>
    </MypageLayout>
  );
}
