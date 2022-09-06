import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { CardDetail } from '@project-lc/components-shared/payment/CardDetail';
import { TransferDetail } from '@project-lc/components-shared/payment/TransferDetail';
import { VirtualAccountDetail } from '@project-lc/components-shared/payment/VirtualAccountDetail';
import { ExportDialog } from '@project-lc/components-seller/ExportDialog';
import {
  useAdminOrder,
  useAdminOrderPatchMutation,
  useOrderItemOptionUpdateMutation,
  usePaymentByOrderCode,
} from '@project-lc/hooks';
import { orderProcessStepKoreanDict, UpdateOrderDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { OrderItemOption, OrderProcessStep } from '@prisma/client';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import { ArrowForwardIcon } from '@chakra-ui/icons';

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

  const changableStatuses = useMemo<OrderProcessStep[]>(
    () =>
      Object.keys(orderProcessStepKoreanDict).filter(
        (k) =>
          ![
            'partialShipping',
            'shipping',
            'partialShippingDone',
            'shippingDone',
            'purchaseConfirmed',
            // 출고상태
            'exportReady',
            'partialExportReady',
            'exportDone',
            'partialExportDone',
          ].includes(k),
      ) as OrderProcessStep[],
    [],
  );

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

  const exportDialog = useDisclosure();
  const orderItemOptionSteps = getOrderItemOptionSteps(data);
  return (
    <AdminPageLayout>
      <Center>
        {data && (
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
              <Text>선물주문여부</Text>
              <Text color={data.giftFlag ? 'red.500' : 'unset'}>
                {data.giftFlag ? '이 주문은 선물 주문입니다' : 'X'}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>단계</Text>
              <Flex>
                {!isEdit ? (
                  <>
                    {orderItemOptionSteps.map((oios) => (
                      <OrderStatusBadge key={oios} step={oios} />
                    ))}
                  </>
                ) : (
                  <Box>
                    <Select
                      placeholder="Select option"
                      size="xs"
                      onChange={(e) =>
                        onSelectChange(e.target.value as UpdateOrderDto['step'])
                      }
                    >
                      {changableStatuses.map((key) => (
                        <option value={key} key={key}>
                          {orderProcessStepKoreanDict[key]}
                        </option>
                      ))}
                    </Select>
                    <Text fontSize="xs" px={2}>
                      - 배송중,배송완료,구매확정 상태로의 변경은 출고상태를 변경하여
                      진행해주세요.
                    </Text>
                    <Text fontSize="xs" px={2}>
                      - 출고상태로의 변경은 출고처리를 통해 진행해주세요
                    </Text>
                  </Box>
                )}
                <Button size="xs" onClick={handleButtonClick}>
                  {!isEdit ? '상태일괄변경' : '취소'}
                </Button>
              </Flex>
            </Flex>
            <Box>
              <Text>주문상품</Text>
              {data.orderItems.map((item) => (
                <Grid
                  templateColumns="repeat(6,2fr)"
                  key={item.id}
                  mt={3}
                  mb={3}
                  gap={1}
                  rounded="md"
                  p={2}
                  borderWidth="thin"
                >
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
                  {item.options.map((option) => (
                    <OrderItemOptionGridItem key={option.id} {...option} />
                  ))}
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
              <Text>
                {data.giftFlag ? (
                  <Text as="span" color="red.500">
                    {'[선물주문!] 아래 배송지는 방송인 선물 수령지입니다. => '}
                  </Text>
                ) : null}
                {data.recipientName}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>수령인 연락처</Text>
              <Text>{data.recipientPhone}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>배송지</Text>
              <Flex
                direction="column"
                alignItems="flex-end"
                border="1px"
                p={1}
                rounded="md"
              >
                <Text>({data.recipientPostalCode})</Text>
                <Text>{data.recipientAddress}</Text>
                <Text>{data.recipientDetailAddress}</Text>
                <Text>배송메시지: {data.memo}</Text>
              </Flex>
            </Flex>

            {!paymentData ? (
              <Box>
                <Text color="red.500">TossPayments로부터 결제정보를 불러올 수 없음.</Text>
              </Box>
            ) : (
              <Box>
                <Text>결제정보</Text>
                <Grid
                  templateColumns="repeat(2, 5fr)"
                  minWidth="300px"
                  border="1px"
                  p={1}
                >
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
            )}

            <Box mt={6}>
              <Text fontWeight="bold">출고정보</Text>
              {data.exports.map((e, i) => (
                <Box key={e.exportCode}>
                  <NextLink href={`/order/exports/${e.exportCode}`}>
                    <Link color="blue">
                      {i + 1}. {e.exportCode}: {e.deliveryCompany} {e.deliveryNumber}
                    </Link>
                  </NextLink>
                </Box>
              ))}
            </Box>
            <Box mt={6}>
              <Text fontWeight="bold">출고관리</Text>
              <Box>
                <Button size="sm" onClick={exportDialog.onOpen}>
                  출고처리
                </Button>
                <ExportDialog
                  isOpen={exportDialog.isOpen}
                  onClose={exportDialog.onClose}
                  order={data}
                />
              </Box>
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
        {data?.orderItems.map((oi) => (
          <Box key={oi.id}>
            {oi.options.map((oio) => (
              <Box key={oio.id}>
                <Flex gap={2}>
                  {oio.name && oio.value && (
                    <Text>
                      {oio.name} : {oio.value}{' '}
                    </Text>
                  )}
                  <OrderStatusBadge step={oio.step} />
                  <ArrowForwardIcon />
                  <OrderStatusBadge step={orderStep} />
                </Flex>
              </Box>
            ))}
          </Box>
        ))}
      </ConfirmDialog>
    </AdminPageLayout>
  );
}

export default OrderDetail;

function OrderItemOptionGridItem(option: OrderItemOption): JSX.Element {
  const backgroundColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <GridItem key={option.id} colSpan={6} p={1} rounded="md" borderWidth="thin">
      <Grid templateColumns="repeat(10,1fr)" gap={1}>
        <GridItem bgColor={backgroundColor}>
          <Center>
            <Text>{option?.name}</Text>
          </Center>
        </GridItem>
        <GridItem>
          <Text>{option?.value}</Text>
        </GridItem>
        <GridItem bgColor={backgroundColor}>
          <Center>
            <Text>정가</Text>
          </Center>
        </GridItem>
        <GridItem>
          <Text>{option?.normalPrice}</Text>
        </GridItem>
        <GridItem bgColor={backgroundColor}>
          <Center>
            <Text>할인가</Text>
          </Center>
        </GridItem>
        <GridItem>
          <Text>{option?.discountPrice}</Text>
        </GridItem>
        <GridItem bgColor={backgroundColor}>
          <Center>
            <Text>수량</Text>
          </Center>
        </GridItem>
        <GridItem>
          <Text>{option?.quantity}</Text>
        </GridItem>
        <GridItem bgColor={backgroundColor}>
          <Center>
            <Text>상태</Text>
          </Center>
        </GridItem>
        <GridItem>
          <OrderStatusBadge step={option?.step} />
          <Button onClick={onOpen} size="xs">
            변경
          </Button>
          <OrderItemOptionUpdateDialog
            id={option.id}
            name={option.name}
            value={option.value}
            currentStep={option.step}
            isOpen={isOpen}
            onClose={onClose}
          />
        </GridItem>
      </Grid>
    </GridItem>
  );
}

interface OrderItemOptionUpdateDialogProps {
  id: number;
  name?: string;
  value?: string;
  currentStep: OrderProcessStep;
  isOpen: boolean;
  onClose: () => void;
}
function OrderItemOptionUpdateDialog({
  id,
  name,
  value,
  currentStep,
  isOpen,
  onClose,
}: OrderItemOptionUpdateDialogProps): JSX.Element {
  const changableStatuses = useMemo<OrderProcessStep[]>(
    () =>
      Object.keys(orderProcessStepKoreanDict).filter(
        (k) =>
          ![
            'partialShipping',
            'shipping',
            'partialShippingDone',
            'shippingDone',
            'purchaseConfirmed',
            // 출고상태
            'exportReady',
            'partialExportReady',
            'exportDone',
            'partialExportDone',
          ].includes(k),
      ) as OrderProcessStep[],
    [],
  );
  const [selected, setSelected] = useState<OrderProcessStep | undefined>(undefined);
  const onSelectChange = (targeValue: OrderProcessStep): void => {
    setSelected(targeValue);
  };

  const toast = useToast();
  const { mutateAsync: update } = useOrderItemOptionUpdateMutation();
  const onSubmit = async (): Promise<void> => {
    return update({ orderItemOptionId: id, step: selected })
      .then(() => {
        toast({ title: '수정성공', status: 'success' });
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '수정실패',
          description: err.response?.data?.message,
          status: 'error',
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>주문상품옵션 변경</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>변경상태 선택</Text>
            <Select
              value={selected}
              placeholder="Select option"
              onChange={(e) => onSelectChange(e.target.value as OrderProcessStep)}
            >
              {changableStatuses.map((key) => (
                <option value={key} key={key}>
                  {orderProcessStepKoreanDict[key]}
                </option>
              ))}
            </Select>

            {selected ? (
              <Flex mt={4} gap={2} align="center" justify="center">
                {name && value && (
                  <Text>
                    {name}: {value}{' '}
                  </Text>
                )}
                <OrderStatusBadge step={currentStep} />
                <ArrowForwardIcon />
                <OrderStatusBadge step={selected} />
              </Flex>
            ) : null}
          </Box>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="blue" onClick={onSubmit}>
              확인
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
