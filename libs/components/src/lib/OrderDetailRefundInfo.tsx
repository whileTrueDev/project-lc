import { Text, Box, Stack, Link, Flex, Avatar } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  FmOrderOption,
  FmOrderRefund,
  convertFmRefundTypesToString,
} from '@project-lc/shared-types';
import { FmRefundStatusBadge, TextDotConnector, OrderDetailOptionListItem } from '..';

/** 주문 환불 정보 */
export function OrderDetailRefundInfo({
  options,
  refund,
}: {
  options: FmOrderOption[];
  refund: FmOrderRefund;
}) {
  // 이 환불에 포함된 상품(옵션) 목록
  const refundOrderItemOptions = useMemo(() => {
    return options.filter((opt) => opt.refund_code === refund.refund_code);
  }, [options, refund.refund_code]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {refund.refund_code}
        </Link>
        <FmRefundStatusBadge refundStatus={refund.status} />
        <TextDotConnector />
        <Text isTruncated>{refund.ea} 개</Text>
        <TextDotConnector />
        <Text isTruncated>{Number(refund.refund_goods_price).toLocaleString()} 원</Text>
      </Stack>

      <Stack>
        <Text>환불 유형: {convertFmRefundTypesToString(refund.refund_type)}</Text>
        <Text>
          (환불요청일) {dayjs(refund.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
        {refund.refund_date && (
          <Text>
            (환불완료일) {dayjs(refund.refund_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Text>
        )}
      </Stack>

      <Box my={4}>
        <Text my={1} fontWeight="bold">
          환불 처리 관리자
        </Text>
        <Flex>
          <Avatar />
          <Box ml={4}>
            <Text>{refund.manager_id}</Text>
            <Text>{refund.memail}</Text>
          </Box>
        </Flex>
      </Box>

      {/* 이 환불에 포함된 상품(옵션) 목록 */}
      {refundOrderItemOptions.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold">환불 상품</Text>
          {refundOrderItemOptions.map((o) => (
            <OrderDetailOptionListItem
              key={o.item_option_seq}
              option={o}
              withBadge={false}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
