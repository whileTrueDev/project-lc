import { ChevronLeftIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SellerOrderCancelRequestStatus } from '@prisma/client';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminOneOrderCancelRequest,
  useSellerOrderCancelDoneFlagMutation,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React from 'react';

export function OrderCancelRequestDetail(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const orderId = router.query.orderId as string;
  const orderCancelRequest = useAdminOneOrderCancelRequest(orderId);

  const changeDoneFlag = useSellerOrderCancelDoneFlagMutation();

  const confirmHandler = async (): Promise<void> => {
    if (!orderCancelRequest.data) return;
    try {
      changeDoneFlag.mutateAsync({
        requestId: orderCancelRequest.data.id,
      });
      toast({ title: '처리 완료', status: 'success' });
      router.back();
    } catch (error) {
      console.error(error);
      toast({ title: '처리 실패', status: 'error' });
    }
  };

  if (orderCancelRequest.isLoading) {
    return (
      <AdminPageLayout>
        <Center>
          <Spinner />
        </Center>
      </AdminPageLayout>
    );
  }
  if (!orderCancelRequest.data) {
    return (
      <AdminPageLayout>
        <Button
          size="sm"
          leftIcon={<ChevronLeftIcon />}
          onClick={() => router.push('/order-cancel')}
        >
          목록으로
        </Button>
        <Text>...no data</Text>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <Stack spacing={4} p={2}>
        <Box>
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => router.push('/order-cancel')}
          >
            목록으로
          </Button>
        </Box>

        <Box>
          <Heading>주문번호 {orderId}</Heading>
          <Link
            href={`http://whiletrue.firstmall.kr/admin/order/view?query_string=&no=${orderId}`}
            isExternal
            textDecoration="underline"
            fontSize="lg"
            mr={3}
          >
            <ExternalLinkIcon mr={1} />
            퍼스트몰 주문정보 보러가기
          </Link>
          {orderCancelRequest.data.status !==
            SellerOrderCancelRequestStatus.confirmed && (
            <Button onClick={onOpen}>해당 결제취소요청 처리 완료하기</Button>
          )}
        </Box>

        <Box>
          <Text fontSize="large" fontWeight="bold">
            판매자
          </Text>
          <Text>이메일 : {orderCancelRequest.data.seller.email}</Text>
          <Text>
            상점명 : {orderCancelRequest.data.seller?.sellerShop?.shopName || ''}
          </Text>
        </Box>

        <Box>
          <Text fontSize="large" fontWeight="bold">
            신청일
          </Text>

          <Text>
            {dayjs(orderCancelRequest.data.createDate as Date).format('YYYY/MM/DD HH:mm')}
          </Text>
        </Box>

        <Box>
          <Text fontSize="large" fontWeight="bold">
            결제취소 사유
          </Text>
          <Text>{orderCancelRequest.data.reason}</Text>
        </Box>

        <Box>
          <Text fontSize="large" fontWeight="bold">
            결제취소 요청 상품 및 개수
          </Text>
          {/* 취소요청 상품 목록 */}
          {/* <Stack spacing={2}>
            {orderCancelRequest.data.orderCancelItems.map((item: any) => {
              const { id, amount, orderItemSeq, orderItemOptionSeq } = item;
              const orderedItem = fmOrder.data.items.find(
                (ordered) => ordered.item_seq === orderItemSeq,
              );
              const orderedOption = orderedItem.options.find(
                (orderedOpt) => orderedOpt.item_option_seq === orderItemOptionSeq,
              );
              return (
                <React.Fragment key={id}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <ChakraNextImage
                        layout="intrinsic"
                        width={60}
                        height={60}
                        alt=""
                        src={`http://whiletrue.firstmall.kr${orderedItem.image || ''}`}
                      />
                    </Box>

                    <Stack spacing={1}>
                      <Text>상품명 : {orderedItem.goods_name}</Text>
                      <Text>
                        옵션명 : {orderedOption.title1} {orderedOption.option1}
                      </Text>
                      <Text>취소 요청 개수 : {amount}</Text>
                    </Stack>
                  </Stack>
                  <Divider />
                </React.Fragment>
              );
            })}
          </Stack> */}
        </Box>

        <ConfirmDialog
          title="결제취소 처리 완료하기"
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={confirmHandler}
        >
          퍼스트몰에서 해당 주문의 결제취소 처리를 완료하셨습니까?
        </ConfirmDialog>
      </Stack>
    </AdminPageLayout>
  );
}

export default OrderCancelRequestDetail;
