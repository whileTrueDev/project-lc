import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import {
  useAdminOrder,
  useAdminOrderPatchMutation,
  usePaymentByOrderCode,
} from '@project-lc/hooks';
import {
  orderProcessStepKoreanDict,
  Payment,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const { orderId } = router.query;
  const { data } = useAdminOrder(Number(orderId));
  const { data: paymentData } = usePaymentByOrderCode(data?.orderCode);
  const { mutateAsync } = useAdminOrderPatchMutation(Number(orderId));
  const [isEdit, setIsEdit] = useState(false);
  const [orderStep, setOrderStep] = useState<UpdateOrderDto['step']>('orderReceived');
  const backgroundColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleButtonClick = (): void => {
    setIsEdit(!isEdit);
  };

  const onSelectChange = (value: UpdateOrderDto['step']): void => {
    setOrderStep(value);
    onOpen();
  };

  const handleSubmit = async (): Promise<void> => {
    mutateAsync({ step: orderStep })
      .then(() => {
        toast({ description: '변경완료', status: 'success' });
        setIsEdit(false);
      })
      .catch(() => {
        toast({ description: '변경실패', status: 'error' });
      });
  };

  return (
    <AdminPageLayout>
      <Center>
        {data && paymentData && (
          <Box p={3} w="3xl">
            <Heading mb={3}>{data.orderCode}</Heading>
            <Flex justifyContent="space-between">
              <Text>결제금액</Text>
              <Text>{data.paymentPrice.toLocaleString()}원</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>주문코드</Text>
              <Text>{data.orderCode}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>주문자명</Text>
              <Text>{data.ordererName}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>주문자 연락처</Text>
              <Text>{data.ordererPhone}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>주문자 이메일</Text>
              <Text>{data.ordererEmail}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>단계</Text>
              <Flex>
                {!isEdit ? (
                  <OrderStatusBadge step={data.step} />
                ) : (
                  <Select
                    placeholder="Select option"
                    size="xs"
                    defaultValue={data.step}
                    onChange={(e) =>
                      onSelectChange(e.target.value as UpdateOrderDto['step'])
                    }
                  >
                    {Object.keys(orderProcessStepKoreanDict).map((key, index) => (
                      <option value={key} key={key}>
                        {Object.values(orderProcessStepKoreanDict)[index]}
                      </option>
                    ))}
                  </Select>
                )}

                <Button size="xs" onClick={handleButtonClick}>
                  {!isEdit ? '변경' : '취소'}
                </Button>
              </Flex>
            </Flex>
            <Box>
              <Text>주문상품</Text>
              {data.orderItems.map((item) => (
                <Grid templateColumns="repeat(6,2fr)" key={item.id} mt={3} mb={3} gap={1}>
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>상품명</Text>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text>{item.goods.goods_name}</Text>
                  </GridItem>
                  <GridItem />
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>판매자</Text>
                    </Center>
                  </GridItem>
                  <GridItem>
                    <Text>{item.goods.seller.sellerShop.shopName}</Text>
                  </GridItem>
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>{item.options[0]?.name}</Text>
                    </Center>
                  </GridItem>
                  <GridItem>
                    <Text>{item.options[0]?.value}</Text>
                  </GridItem>
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>정가</Text>
                    </Center>
                  </GridItem>
                  <GridItem>
                    <Text>{item.options[0]?.normalPrice}</Text>
                  </GridItem>
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>할인가</Text>
                    </Center>
                  </GridItem>
                  <GridItem>
                    <Text>{item.options[0]?.discountPrice}</Text>
                  </GridItem>
                  <GridItem bgColor={backgroundColor}>
                    <Center>
                      <Text>수량</Text>
                    </Center>
                  </GridItem>
                  <GridItem>
                    <Text>{item.options[0]?.quantity}</Text>
                  </GridItem>
                  {item.support && (
                    <>
                      <GridItem bgColor={backgroundColor}>
                        <Center>
                          <Text>후원정보</Text>
                        </Center>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Avatar size="xs" src={item.support.broadcaster.avatar} />
                        <Text fontSize="sm">
                          방송인: {item.support.broadcaster.userNickname}
                        </Text>
                        <Text fontSize="sm">메시지: {item.support.message}</Text>
                      </GridItem>
                    </>
                  )}
                </Grid>
              ))}
            </Box>
            <Flex justifyContent="space-between">
              <Text>수령인 이름</Text>
              <Text>{data.recipientName}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>수령인 연락처</Text>
              <Text>{data.recipientPhone}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>배송지</Text>
              <Flex direction="column" alignItems="flex-end" border="1px" p={1}>
                <Text>({data.recipientPostalCode})</Text>
                <Text>{data.recipientAddress}</Text>
                <Text>{data.recipientDetailAddress}</Text>
              </Flex>
            </Flex>
            <Box>
              <Text>결제정보</Text>
              <Grid templateColumns="repeat(2, 5fr)" minWidth="300px" border="1px" p={1}>
                <GridItem>
                  <Text>결제키</Text>
                </GridItem>
                <GridItem>
                  <Text>{data.payment?.paymentKey}</Text>
                </GridItem>
                <GridItem>
                  <Text>결제수단</Text>
                </GridItem>
                <GridItem>
                  <Text>{paymentData.method}</Text>
                </GridItem>
                {paymentData.method === '카드' && (
                  <CardDetail paymentData={paymentData} />
                )}
                {paymentData.method === '가상계좌' && (
                  <VirtualAccountDetail paymentData={paymentData} />
                )}
                {paymentData.method === '계좌이체' && (
                  <TransferDetail paymentData={paymentData} />
                )}
                <GridItem>
                  <Text>요청일시</Text>
                </GridItem>
                <GridItem>
                  <Text>
                    {dayjs(paymentData.requestedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </GridItem>
              </Grid>
            </Box>
          </Box>
        )}
      </Center>
      <ConfirmDialog
        title="변경하시겠습니까?"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSubmit}
      >
        <Text>
          현재 상태: <OrderStatusBadge step={data?.step} />
        </Text>
        <Text>
          변경될 상태 : <OrderStatusBadge step={orderStep} />
        </Text>
      </ConfirmDialog>
    </AdminPageLayout>
  );
}

type TossPaymentDetailProps = {
  paymentData: Payment;
};

export function CardDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>카드사</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card.company}</Text>
      </GridItem>
      <GridItem>
        <Text>카드번호</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card.number}</Text>
      </GridItem>
      <GridItem>
        <Text>할부개월</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card.installmentPlanMonths}</Text>
      </GridItem>
    </>
  );
}

export function VirtualAccountDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>은행</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount.bank}</Text>
      </GridItem>
      <GridItem>
        <Text>계좌타입</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount.accountType}</Text>
      </GridItem>
      <GridItem>
        <Text>입금계좌번호</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount.accountNumber}</Text>
      </GridItem>
      <GridItem>
        <Text>입금기한</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount.dueDate}</Text>
      </GridItem>
      <GridItem>
        <Text>입금상태</Text>
      </GridItem>
      <GridItem>
        <Text>
          {paymentData.virtualAccount.settlementStatus === 'COMPLETE'
            ? '입금완료'
            : '입금대기'}
        </Text>
      </GridItem>
    </>
  );
}

export function TransferDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>은행</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.transfer.bank}</Text>
      </GridItem>
      <GridItem>
        <Text>계좌타입</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.transfer.settlementStatus}</Text>
      </GridItem>
    </>
  );
}

export default OrderDetail;
