import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Center,
  Box,
  Button,
  ListItem,
  OrderedList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components';
import { useFmExport } from '@project-lc/hooks';
import { useRouter } from 'next/router';

import { OrderDetailLoading } from '../orders/[orderId]';

export default function ExportsDetail() {
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
          <Button size="sm" leftIcon={<ChevronLeftIcon />} onClick={() => router.back()}>
            목록으로
          </Button>
        </Box>

        <Box as="section">
          <Text>{id}</Text>
          <OrderedList>
            <ListItem>출고정보</ListItem>
            <ListItem>연결된 주문(주문번호, 클릭시 주문으로 이동)</ListItem>
          </OrderedList>

          <pre>{JSON.stringify(exp.data, null, 2)}</pre>
        </Box>
      </Stack>
    </MypageLayout>
  );
}
