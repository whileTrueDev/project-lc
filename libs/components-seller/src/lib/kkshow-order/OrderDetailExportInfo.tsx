import { Box, Link, Stack, Text } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { FmOrderStatusBadge } from '@project-lc/components-shared/FmOrderStatusBadge';
import {
  convertFmDeliveryCompanyToString,
  ExportBaseData,
  orderProcessStepDict,
} from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useMemo } from 'react';
// import { OrderDetailOptionListItem } from './OrderDetailOptionList';

/** 주문 출고 정보 */
export function OrderDetailExportInfo({
  exportData,
}: {
  exportData: ExportBaseData;
}): JSX.Element {
  const totalExportedEa = useMemo(() => {
    return exportData.items.reduce((prev, curr) => {
      return prev + Number(curr.amount);
    }, 0);
  }, [exportData.items]);

  // * 이 출고의 택배사 정보
  const deliveryCompany = useMemo(
    () => convertFmDeliveryCompanyToString(exportData.deliveryCompany),
    [exportData.deliveryCompany],
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        {/* // TODO: 출고상세보기 페이지 작업 후 연결 */}
        {/* <NextLink href={`/mypage/orders/exports/${exportData.exportCode}`} passHref> */}
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {exportData.exportCode}
        </Link>
        {/* </NextLink> */}
        <FmOrderStatusBadge orderStatus={orderProcessStepDict[exportData.status]} />
        <TextDotConnector />
        <Text isTruncated>{getLocaleNumber(totalExportedEa)} 개</Text>
      </Stack>

      <Stack direction="row" flexWrap="wrap" spacing={1.5} alignItems="center">
        <Text>{deliveryCompany}</Text>
        <TextDotConnector />
        <Text>{exportData.deliveryNumber}</Text>
        {/* 배송 조회 기능 아직 준비중이므로 주석처리 by @dan */}
        {/* <Button
          size="sm"
          onClick={() => alert(`택배조회 ${deliveryCompany} ${_exports.delivery_number}`)}
        >
          배송 조회
        </Button> */}
      </Stack>

      <Stack mt={2} spacing={1.5}>
        <Text>(출고일) {dayjs(exportData.exportDate).format('YYYY년 MM월 DD일')}</Text>

        {exportData.shippingDoneDate && (
          <Text>
            (배송완료일) {dayjs(exportData.shippingDoneDate).format('YYYY년 MM월 DD일')}
          </Text>
        )}
      </Stack>

      {/* // TODO: 출고상품정보 표시 <OrderDetailExportInfoItem> */}
    </Box>
  );
}
