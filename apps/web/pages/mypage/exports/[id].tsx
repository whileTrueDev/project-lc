import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Center,
  Box,
  Button,
  ListItem,
  OrderedList,
  Stack,
  Text,
  Heading,
  HStack,
  List,
  ListIcon,
  Alert,
} from '@chakra-ui/react';
import {
  FmOrderStatusBadge,
  MypageLayout,
  TextDotConnector,
} from '@project-lc/components';
import { useFmExport } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import {
  convertFmDeliveryCompanyToString,
  convertOrderSitetypeToString,
  FmExportRes,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';

import React from 'react';
import { AiTwotoneEnvironment } from 'react-icons/ai';
import { FaBoxOpen } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
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
          <ExportDetailTitle exportData={exp.data} />
        </Box>

        <Box as="section">
          <ExportDetailSummary exportData={exp.data} />
        </Box>

        <Box as="section">
          <pre>{JSON.stringify(exp.data, null, 2)}</pre>
        </Box>
      </Stack>
    </MypageLayout>
  );
}

export interface ExportDetailTitleProps {
  exportData: FmExportRes;
}
export function ExportDetailTitle({ exportData }: ExportDetailTitleProps) {
  return (
    <Box>
      <Heading>출고 {exportData.export_code}</Heading>
      <HStack alignItems="center">
        <FmOrderStatusBadge orderStatus={exportData.status} />
        <TextDotConnector />
        <Text>{dayjs(exportData.export_date).fromNow()} 출고</Text>
      </HStack>
    </Box>
  );
}

export interface ExportDetailSummaryProps {
  exportData: FmExportRes;
}
export function ExportDetailSummary({ exportData }: ExportDetailSummaryProps) {
  return (
    <List spacing={2}>
      {exportData.shipping_date ? (
        <ListItem isTruncated display="inline-block">
          <Alert status="info" pl={0}>
            <ListIcon boxSize="1.5rem" as={AiTwotoneEnvironment} color="green.500" />
            배송완료일{' '}
            {dayjs(exportData.shipping_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Alert>
        </ListItem>
      ) : null}

      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={MdDateRange} color="green.500" />
        출고일 {dayjs(exportData.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={FaBoxOpen} color="green.500" />
        택배사 {convertFmDeliveryCompanyToString(exportData.delivery_company_code)}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={IoMdPerson} color="green.500" />
        송장번호 {exportData.delivery_number}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={AiTwotoneEnvironment} color="green.500" />
        출고 상품 개수 {exportData.items.length} 개
      </ListItem>
    </List>
  );
}
