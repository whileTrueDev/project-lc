import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ChakraNextImage,
  FmOrderStatusBadge,
  FmRefundStatusBadge,
  FmReturnStatusBadge,
  MypageLayout,
  ShowMoreTextButton,
  TextDotConnector,
} from '@project-lc/components';
import { useFmOrder } from '@project-lc/hooks';
import {
  convertFmDeliveryCompanyToString,
  convertFmOrderStatusToString,
  convertFmRefundTypesToString,
  convertOrderSitetypeToString,
  FindFmOrderDetailRes,
  FmOrderExport,
  FmOrderOption,
  FmOrderRefund,
  fmOrderStatuses,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AiTwotoneEnvironment } from 'react-icons/ai';
import { FaBoxOpen } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import React from 'react-transition-group/node_modules/@types/react';

dayjs.locale('ko');
dayjs.extend(relativeTime);

export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = useFmOrder(orderId);

  if (order.isLoading)
    return (
      <MypageLayout>
        <Center>
          <Spinner />
        </Center>
      </MypageLayout>
    );

  if (!order.isLoading && !order.data)
    return (
      <MypageLayout>
        <Box m="auto" maxW="4xl">
          <Stack spacing={2}>
            <Center>
              <Text>주문 데이터를 불러오지 못했습니다.</Text>
            </Center>
            <Center>
              <Text>주문이 없거나 올바르지 못한 주문번호입니다.</Text>
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
          <Heading>주문 {order.data.id}</Heading>
          <Stack direction="row" alignItems="center">
            <FmOrderStatusBadge orderStatus={order.data.step} />
            {order.data.refunds && (
              <FmRefundStatusBadge refundStatus={order.data.refunds.status} />
            )}
            {order.data.returns && (
              <FmReturnStatusBadge returnStatus={order.data.returns.status} />
            )}
            <TextDotConnector />
            <Text>{dayjs(order.data.regist_date).fromNow()}</Text>
          </Stack>
        </Box>

        <Stack as="section">
          {order.data.returns && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>이 주문에는 반품 요청이 있습니다!</AlertTitle>
              <AlertDescription>
                아래{' '}
                <Button
                  variant="link"
                  textDecoration="underline"
                  colorScheme="messenger"
                  onClick={() => {
                    document.getElementById('반품 정보')?.scrollIntoView();
                  }}
                >
                  반품 정보
                </Button>{' '}
                에서 반품 요청을 확인해주세요.
              </AlertDescription>
            </Alert>
          )}
          {order.data.refunds && (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>이 주문에는 환불 요청이 있습니다!</AlertTitle>
              <AlertDescription>
                아래{' '}
                <Button
                  variant="link"
                  textDecoration="underline"
                  colorScheme="messenger"
                  onClick={() => {
                    document.getElementById('환불 정보')?.scrollIntoView();
                  }}
                >
                  환불 정보
                </Button>{' '}
                에서 환불 요청을 확인해주세요.
              </AlertDescription>
            </Alert>
          )}
        </Stack>

        <Box as="section">
          <List mt={4} spacing={2}>
            <ListItem isTruncated>
              <ListIcon boxSize="1.5rem" as={MdDateRange} color="green.500" />
              주문일시 {dayjs(order.data.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
            </ListItem>
            <ListItem isTruncated>
              <ListIcon boxSize="1.5rem" as={IoMdPerson} color="green.500" />
              주문자 {order.data.order_user_name}
            </ListItem>
            <ListItem isTruncated>
              <ListIcon boxSize="1.5rem" as={FaBoxOpen} color="green.500" />
              수령자 {order.data.recipient_user_name}
            </ListItem>
            <ListItem isTruncated>
              <ListIcon boxSize="1.5rem" as={AiTwotoneEnvironment} color="green.500" />
              {convertOrderSitetypeToString(order.data.sitetype)}에서 주문
            </ListItem>
          </List>
        </Box>

        <OrderDetailSection title="주문 상품 정보">
          <OrderDetailGoods order={order.data} />
          <OrderDetailOptionList options={order.data.options} />
        </OrderDetailSection>

        <OrderDetailSection title="주문자 / 수령자 정보">
          <OrderDetailDeliveryInfo order={order.data} />
        </OrderDetailSection>

        {order.data.exports && (
          <OrderDetailSection title="출고 정보">
            <OrderDetailExportInfo
              options={order.data.options}
              exports={order.data.exports}
            />
          </OrderDetailSection>
        )}

        {order.data.returns && (
          <OrderDetailSection title="반품 정보">
            <Box>반품 정보</Box>
            <Box>반품 정보</Box>
            <Box>반품 정보</Box>
          </OrderDetailSection>
        )}

        {order.data.refunds && (
          <OrderDetailSection title="환불 정보">
            <OrderDetailRefundInfo
              options={order.data.options}
              refund={order.data.refunds}
            />
          </OrderDetailSection>
        )}
      </Stack>
    </MypageLayout>
  );
}

export default OrderDetail;

export function OrderDetailSection({
  title,
  children,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <Divider />
      <Box as="section" id={title}>
        <Heading as="h4" size="md" isTruncated my={2}>
          {title}
        </Heading>
        {children}
      </Box>
    </>
  );
}

export function OrderDetailGoods({ order }: { order: FindFmOrderDetailRes }) {
  const orderPrice = useMemo(() => {
    const reduced = order.options.reduce((p, c) => p + Number(c.price), 0);
    return `${reduced.toLocaleString()} 원`;
  }, [order.options]);
  return (
    <Flex>
      <ChakraNextImage
        layout="intrinsic"
        width={60}
        height={60}
        src={`http://whiletrue.firstmall.kr${order.image}`}
      />
      <Box ml={4}>
        <Text>{order.goods_name}</Text>
        <Text>총 주문금액 {orderPrice}</Text>
      </Box>
    </Flex>
  );
}

export function OrderDetailOptionList({ options }: { options: FmOrderOption[] }) {
  return (
    <Box mt={4}>
      {options.map((goodsOpt) => (
        <OrderDetailOptionListItem key={goodsOpt.item_option_seq} option={goodsOpt} />
      ))}

      <Box mt={2}>
        <ShowMoreTextButton />
      </Box>
    </Box>
  );
}

export function OrderDetailOptionListItem({
  option,
  withBadge = true,
}: {
  option: FmOrderOption;
  withBadge?: boolean;
}) {
  const orderPrice = useMemo(() => {
    const price = Number(option.price) * Number(option.ea);
    return `${price.toLocaleString()} 원`;
  }, [option.ea, option.price]);
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
      {withBadge && <FmOrderStatusBadge orderStatus={option.step} />}
      <Text isTruncated>
        {option.title1}: {option.option1}
      </Text>
      {option.color && (
        <Box w={4} h={4} bgColor={option.color} border="1px solid black" />
      )}
      <TextDotConnector />
      <Text isTruncated>{option.ea} 개</Text>
      <TextDotConnector />
      <Text isTruncated>{orderPrice}</Text>
    </Stack>
  );
}

export function OrderDetailOrderStatusTable({ option }: { option: FmOrderOption }) {
  return (
    <Table maxW={320} variant="simple" size="md">
      <Thead>
        <Tr>
          <Th>상태</Th>
          <Th>개수</Th>
        </Tr>
      </Thead>

      <Tbody>
        {['35', '45', '55', '65', '75', '85'].map((step) => (
          <Tr>
            <Td>{fmOrderStatuses[step].name}</Td>
            <Td>{option[`step${step}`]}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export function OrderDetailDeliveryInfo({ order }: { order: FindFmOrderDetailRes }) {
  // 주문자 전화
  const ordererPhone = useMemo(() => {
    return order.order_phone === '--' ? null : order.order_phone;
  }, [order.order_phone]);
  // 수령자 전화
  const recipientPhone = useMemo(() => {
    return order.recipient_phone === '--' ? null : order.recipient_phone;
  }, [order.recipient_phone]);

  // 지번 주소
  const addressJibun = useMemo(
    () => `${order.recipient_address_street} ${order.recipient_address_detail}`,
    [order.recipient_address_detail, order.recipient_address_street],
  );
  // 도로명주소
  const addressStreet = useMemo(
    () => `${order.recipient_address} ${order.recipient_address_detail}`,
    [order.recipient_address, order.recipient_address_detail],
  );

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }}>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">주문자</Text>
        </Box>
        <Text>{order.order_user_name}</Text>
        <Text>{order.order_email}</Text>
        {ordererPhone && <Text>{ordererPhone}</Text>}
        <Text>{order.order_cellphone}</Text>
      </Stack>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">수령자</Text>
        </Box>
        <Text>{order.recipient_user_name}</Text>
        <Text>(지번) {addressJibun}</Text>
        <Text>(도로명) {addressStreet}</Text>
        {recipientPhone && <Text>{recipientPhone}</Text>}
        <Text>{order.recipient_cellphone}</Text>
        <Text>{order.recipient_email}</Text>
      </Stack>
    </SimpleGrid>
  );
}

export function OrderDetailExportInfo({
  options,
  exports,
}: {
  options: FmOrderOption[];
  exports: FmOrderExport;
}) {
  // 이 출고에 포함된 상품(옵션) 목록
  const exportOrderItemOptions = useMemo(() => {
    return options.filter((opt) => opt.export_code === exports.export_code);
  }, [exports.export_code, options]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {exports.export_code}
        </Link>
        <FmOrderStatusBadge orderStatus={exports.export_status} />
        <TextDotConnector />
        <Text isTruncated>{exports.ea} 개</Text>
        <TextDotConnector />
        <Text isTruncated>{Number(exports.price).toLocaleString()} 원</Text>
      </Stack>

      <Stack direction="row" flexWrap="wrap" spacing={1.5}>
        <Text>{convertFmDeliveryCompanyToString(exports.delivery_company_code)}</Text>
        <TextDotConnector />
        <Text>{exports.delivery_number}</Text>
        <Button size="sm">택배 조회</Button>
      </Stack>

      <Stack>
        <Text>(출고일) {dayjs(exports.export_date).format('YYYY년 MM월 DD일')}</Text>
        {exports.complete_date && (
          <Text>
            (출고완료일) {dayjs(exports.complete_date).format('YYYY년 MM월 DD일')}
          </Text>
        )}
        {exports.shipping_date && (
          <Text>
            (배송완료일) {dayjs(exports.shipping_date).format('YYYY년 MM월 DD일')}
          </Text>
        )}
      </Stack>

      {/* 이 출고에서 보내진 상품(옵션) 목록 */}
      {exportOrderItemOptions.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold">출고된 상품</Text>
          {exportOrderItemOptions.map((o) => (
            <OrderDetailOptionListItem option={o} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function OrderDetailRefundInfo({
  options,
  refund,
}: {
  options: FmOrderOption[];
  refund: FmOrderRefund;
}) {
  // 이 출고에 포함된 상품(옵션) 목록
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

      {/* 이 출고에서 보내진 상품(옵션) 목록 */}
      {refundOrderItemOptions.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold">환불된 상품</Text>
          {refundOrderItemOptions.map((o) => (
            <OrderDetailOptionListItem option={o} withBadge={false} />
          ))}
        </Box>
      )}
    </Box>
  );
}
