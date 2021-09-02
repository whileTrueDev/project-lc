import { Box, Button, Link, Stack, Text } from '@chakra-ui/react';
import {
  convertFmDeliveryCompanyToString,
  FmOrderExport,
  FmOrderOption,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { FmOrderStatusBadge, OrderDetailOptionListItem, TextDotConnector } from '..';

/** 주문 출고 정보 */
export function OrderDetailExportInfo({
  options,
  exports: _exports,
}: {
  options: FmOrderOption[];
  exports: FmOrderExport;
}) {
  // * 이 출고에 포함된 상품(옵션) 목록
  const exportOrderItemOptions = useMemo(() => {
    return options.filter((opt) => opt.export_code === _exports.export_code);
  }, [_exports.export_code, options]);

  // * 이 출고에 포함된 상품의 총 가격
  const totalExportedPrice = useMemo(() => {
    return exportOrderItemOptions.reduce((prev, curr) => {
      return prev + Number(curr.price);
    }, 0);
  }, [exportOrderItemOptions]);

  const deliveryCompany = useMemo(
    () => convertFmDeliveryCompanyToString(_exports.delivery_company_code),
    [_exports.delivery_company_code],
  );
  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {_exports.export_code}
        </Link>
        <FmOrderStatusBadge orderStatus={_exports.export_status} />
        <TextDotConnector />
        <Text isTruncated>{_exports.ea} 개</Text>
        <TextDotConnector />
        <Text isTruncated>{totalExportedPrice.toLocaleString()} 원</Text>
      </Stack>

      <Stack direction="row" flexWrap="wrap" spacing={1.5} alignItems="center">
        <Text>{deliveryCompany}</Text>
        <TextDotConnector />
        <Text>{_exports.delivery_number}</Text>
        <Button
          size="sm"
          onClick={() => alert(`택배조회 ${deliveryCompany} ${_exports.delivery_number}`)}
        >
          택배 조회
        </Button>
      </Stack>

      <Stack>
        <Text>(출고일) {dayjs(_exports.export_date).format('YYYY년 MM월 DD일')}</Text>
        {_exports.complete_date && (
          <Text>
            (출고완료일) {dayjs(_exports.complete_date).format('YYYY년 MM월 DD일')}
          </Text>
        )}
        {_exports.shipping_date && (
          <Text>
            (배송완료일) {dayjs(_exports.shipping_date).format('YYYY년 MM월 DD일')}
          </Text>
        )}
      </Stack>

      {/* 이 출고에서 보내진 상품(옵션) 목록 */}
      {exportOrderItemOptions.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold">출고된 상품</Text>
          {exportOrderItemOptions.map((o) => (
            <OrderDetailOptionListItem key={o.item_option_seq} option={o} />
          ))}
        </Box>
      )}
    </Box>
  );
}
