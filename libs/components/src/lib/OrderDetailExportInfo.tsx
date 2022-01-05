import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { FmOrderStatusBadge } from '@project-lc/components-shared/FmOrderStatusBadge';
import {
  convertFmDeliveryCompanyToString,
  FindFmOrderDetailRes,
  FmOrderExport,
  FmOrderExportItemOption,
  FmOrderOption,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { OrderDetailOptionListItem } from './OrderDetailOptionList';

/** 주문 출고 정보 */
export function OrderDetailExportInfo({
  exports: _exports,
  orderItems,
}: {
  exports: FmOrderExport;
  orderItems: FindFmOrderDetailRes['items'];
}): JSX.Element {
  // * 이 출고에 포함된 상품의 총 가격
  const totalExportedPrice = useMemo(() => {
    return _exports.itemOptions.reduce((prev, curr) => {
      return prev + Number(curr.price);
    }, 0);
  }, [_exports.itemOptions]);

  const totalExportedEa = useMemo(() => {
    return _exports.itemOptions.reduce((prev, curr) => {
      return prev + Number(curr.ea);
    }, 0);
  }, [_exports.itemOptions]);

  // * 이 출고의 택배사 정보
  const deliveryCompany = useMemo(
    () => convertFmDeliveryCompanyToString(_exports.delivery_company_code),
    [_exports.delivery_company_code],
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <NextLink href={`/mypage/exports/${_exports.export_code}`} passHref>
          <Link isTruncated fontWeight="bold" textDecoration="underline">
            {_exports.export_code}
          </Link>
        </NextLink>
        <FmOrderStatusBadge orderStatus={_exports.export_status} />
        <TextDotConnector />
        <Text isTruncated>{totalExportedEa} 개</Text>
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
      {_exports.itemOptions.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold" mb={2}>
            출고된 상품
          </Text>
          {_exports.itemOptions.map((io) => (
            <OrderDetailExportInfoItem
              key={io.item_option_seq}
              itemOption={io}
              orderItems={orderItems}
              bundleExportCode={_exports.bundle_export_code}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function OrderDetailExportInfoItem({
  itemOption: io,
  orderItems,
  bundleExportCode,
}: {
  itemOption: FmOrderExportItemOption;
  orderItems: FindFmOrderDetailRes['items'];
  bundleExportCode?: string;
}): JSX.Element {
  const emphasizeColor = useColorModeValue('red.500', 'red.300');
  // * 합배송 여부 체크 + 현재 조회중인 주문이 아닌 다른 주문인 지 체크
  const isBundledAndCurrentSeeingOrder = useMemo(() => {
    const allOpts: FmOrderOption[] = [];

    orderItems.forEach((oi) => {
      oi.options.forEach((o) => {
        allOpts.push(o);
      });
    });

    const isCurrent = allOpts.find((x) => x.item_option_seq === io.item_option_seq);
    if (isCurrent) return true;
    return false;
  }, [io.item_option_seq, orderItems]);
  return (
    <Box mb={4}>
      <Flex alignItems="center">
        {io.image && (
          <ChakraNextImage
            layout="intrinsic"
            width={30}
            height={30}
            alt=""
            src={`http://whiletrue.firstmall.kr${io.image || ''}`}
          />
        )}
        <Text ml={io.image ? 2 : 0}>{io.goods_name} </Text>
      </Flex>
      {bundleExportCode && !isBundledAndCurrentSeeingOrder && (
        <Text color={emphasizeColor}>합포장(묶음배송) 상품</Text>
      )}
      <OrderDetailOptionListItem key={io.item_option_seq} option={io} />
    </Box>
  );
}

export default OrderDetailExportInfo;
