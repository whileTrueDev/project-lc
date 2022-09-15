/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SellType } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { CommissionInfo } from '@project-lc/components-shared/CommissionInfo';
import {
  useAdminLatestCheckedData,
  useAdminLatestCheckedDataMutation,
  useCreateSettlementMutation,
  useSellCommission,
  useSellerSettlementTargets,
} from '@project-lc/hooks';
import { SellerSettlementTarget } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useLatestCheckedDataId } from './AdminDatagridWrapper';
import AdminTabAlarmResetButton from './AdminTabAlarmResetButton';

/** 판매자 정산 대상 목록 */
export function SettlementTargetList(): JSX.Element | null {
  const dialog = useDisclosure();
  const targets = useSellerSettlementTargets();

  const [selectedExport, setSelectedExport] = useState<SellerSettlementTarget | null>(
    null,
  );

  const data = useMemo(
    () => [
      {
        header: '출고번호',
        render: (target: SellerSettlementTarget) => <Td w="60px">{target.id}</Td>,
      },
      {
        header: '출고코드',
        render: (target: SellerSettlementTarget) => <Td w="80px">{target.exportCode}</Td>,
      },
      {
        header: '판매자명',
        render: (target: SellerSettlementTarget) => (
          <Td w="100px">{target.seller.sellerShop.shopName}</Td>
        ),
      },
      {
        header: '구매자명',
        render: (target: SellerSettlementTarget) => <Td>{target.order.ordererName}</Td>,
      },
      {
        header: '수령자명',
        render: (target: SellerSettlementTarget) => <Td>{target.order.recipientName}</Td>,
      },
      {
        header: '결제방법',
        render: (target: SellerSettlementTarget) => (
          <Td>{target.order.payment?.method || '알수없음'}</Td>
        ),
      },
      {
        header: '출고날짜',
        render: (target: SellerSettlementTarget) => (
          <Td>{dayjs(target.exportDate).format('YYYY/MM/DD HH:mm:ss')}</Td>
        ),
      },
      {
        header: '구매확정일',
        render: (target: SellerSettlementTarget) => (
          <Td>
            {target.buyConfirmSubject && target.buyConfirmDate
              ? `${dayjs(target.buyConfirmDate).format('YYYY/MM/DD')} by ${
                  target.buyConfirmSubject
                }`
              : '-'}
          </Td>
        ),
      },
      {
        header: '출고에 포함된 상품 총금액',
        render: (target: SellerSettlementTarget) => {
          const amount = target.items.reduce((prev, item) => {
            const money =
              Number(item.orderItemOption.discountPrice) * item.orderItemOption.quantity;
            if (!prev) return money;
            return prev + money;
          }, 0);
          return <Td>{getLocaleNumber(amount)}</Td>;
        },
      },
      {
        header: '정산계좌',
        render: (target: SellerSettlementTarget) => {
          if (!target.seller.sellerSettlementAccount) return <Td>등록안함</Td>;
          return <Td>{target.seller.sellerSettlementAccount?.[0].bank}</Td>;
        },
      },
      {
        header: '자세히보기',
        render: (target: SellerSettlementTarget) => (
          <Td>
            <Button
              size="xs"
              onClick={() => {
                dialog.onOpen();
                setSelectedExport(target);
              }}
            >
              자세히보기
            </Button>
          </Td>
        ),
      },
    ],
    [dialog],
  );

  const latestCheckedDataId = useLatestCheckedDataId();

  const router = useRouter();
  const { data: adminCheckedData } = useAdminLatestCheckedData();
  const { mutateAsync: adminCheckMutation } = useAdminLatestCheckedDataMutation();

  const onResetButtonClick = async (): Promise<void> => {
    if (!targets.data || !targets.data?.[0]) return;
    // 가장 최근 데이터 = id 가장 큰값
    const latestId = targets.data[0].id;

    const dto = { ...adminCheckedData, [router.pathname]: latestId }; // pathname 을 키로 사용
    adminCheckMutation(dto).catch((e) => console.error(e));
  };

  if (!targets.data) return null;
  return (
    <Box>
      <AdminTabAlarmResetButton onClick={onResetButtonClick} />
      <Table size="sm">
        <Thead>
          <Tr>
            {data.map((d) => (
              <Th key={d.header}>{d.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {targets.data.map((target) => {
            return (
              <Tr
                key={target.exportCode}
                bg={target.id > latestCheckedDataId ? 'red.200' : undefined}
              >
                {data.map((d) => d.render(target))}
              </Tr>
            );
          })}
        </Tbody>
        {targets.data.length > 30 && (
          <Tfoot>
            <Tr>
              {data.map((d) => (
                <Th key={d.header}>{d.header}</Th>
              ))}
            </Tr>
          </Tfoot>
        )}
      </Table>

      {selectedExport && (
        <SettlementItemInfoDialog
          isOpen={dialog.isOpen}
          onClose={dialog.onClose}
          selectedSettleItem={selectedExport}
        />
      )}
    </Box>
  );
}

type SettlementItemInfoDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  selectedSettleItem: SellerSettlementTarget;
};
function SettlementItemInfoDialog({
  isOpen,
  onClose,
  selectedSettleItem,
}: SettlementItemInfoDialogProps): JSX.Element {
  const commissionInfo = useSellCommission();
  const toast = useToast();
  const executeDialog = useDisclosure();

  const isAbleToSettle =
    (selectedSettleItem.seller.sellerSettlementAccount || []).length > 0
      ? !!selectedSettleItem.seller.sellerSettlementAccount?.[0]
      : false;

  const [round, setRound] = useState<'1' | '2'>('1');
  const onRoundChange = (r: '1' | '2'): void => {
    setRound(r);
  };

  const executeSettlement = useCreateSettlementMutation();
  const onConfirm = async (): Promise<void> => {
    if (!selectedSettleItem.sellerId) return undefined;
    if (!selectedSettleItem.exportCode) return undefined;
    return executeSettlement
      .mutateAsync({
        sellerId: selectedSettleItem.sellerId,
        round,
        buyer: selectedSettleItem.order.ordererName,
        recipient: selectedSettleItem.order.recipientName,
        startDate: selectedSettleItem.exportDate,
        doneDate: selectedSettleItem.buyConfirmDate,
        exportCode: selectedSettleItem.exportCode,
        exportId: selectedSettleItem.id,
        orderId: selectedSettleItem.orderId,
        paymentMethod: selectedSettleItem.order.payment?.method || 'card',
        items: selectedSettleItem.items.map((item) => {
          let whiletrueCommissionRate: string | null;
          let broadcasterCommissionRate: string | null;
          if (item.orderItem.support.liveShopping) {
            whiletrueCommissionRate =
              item.orderItem.support.liveShopping?.whiletrueCommissionRate.toString() ||
              null;
            broadcasterCommissionRate =
              item.orderItem.support.liveShopping?.broadcasterCommissionRate.toString() ||
              null;
          } else if (item.orderItem.support.productPromotion) {
            whiletrueCommissionRate =
              item.orderItem.support.productPromotion?.whiletrueCommissionRate.toString() ||
              null;
            broadcasterCommissionRate =
              item.orderItem.support.productPromotion?.broadcasterCommissionRate.toString() ||
              null;
          } else {
            whiletrueCommissionRate =
              commissionInfo.data?.commissionRate.toString() || '0';
            broadcasterCommissionRate = '0';
          }
          const broadcasterCommission =
            Number(item.orderItemOption.discountPrice) *
            item.orderItemOption.quantity *
            (Number(broadcasterCommissionRate) * 0.01);
          const whiletrueCommission =
            Number(item.orderItemOption.discountPrice) *
            item.orderItemOption.quantity *
            (Number(whiletrueCommissionRate) * 0.01);
          return {
            relatedOrderId: selectedSettleItem.order.id,
            ea: item.orderItemOption.quantity,
            goods_image: item.orderItem.goods.image[0].image,
            goods_name: item.orderItem.goods.goods_name,
            itemId: item.id, // exportItem.id ? orderItem.id? 뭐가 맞지
            option_title: item.orderItemOption.name,
            option1: item.orderItemOption.value,
            optionId: item.orderItemOption.id,
            price:
              Number(item.orderItemOption.discountPrice) * item.orderItemOption.quantity,
            pricePerPiece: Number(item.orderItemOption.discountPrice),
            sellType: item.orderItem.support.liveShopping
              ? SellType.liveShopping
              : item.orderItem.support.productPromotion
              ? SellType.productPromotion
              : SellType.normal,
            liveShoppingId: item.orderItem.support.liveShopping?.id,
            productPromotionId: item.orderItem.support.productPromotion?.id,
            broadcasterCommissionRate,
            broadcasterCommission,
            whiletrueCommissionRate,
            whiletrueCommission,
          };
        }),
      })
      .then(() => {
        toast({
          title: `출고번호 ${selectedSettleItem.exportCode} 정산처리 완료`,
          status: 'success',
        });
        onClose();
      })
      .catch(() => {
        toast({ title: '정산처리 실패', status: 'error' });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>정산 대상 {selectedSettleItem.exportCode}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedSettleItem.items.map((item) => (
            <SettlementItemOptionDetail
              key={item.id}
              settlementTarget={selectedSettleItem}
              item={item}
            />
          ))}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            닫기
          </Button>
          <Button
            colorScheme="blue"
            onClick={executeDialog.onOpen}
            isDisabled={!isAbleToSettle}
          >
            정산처리진행
          </Button>
        </ModalFooter>
      </ModalContent>

      <ConfirmDialog
        isOpen={executeDialog.isOpen}
        onClose={executeDialog.onClose}
        title={selectedSettleItem.exportCode || ''}
        onConfirm={onConfirm}
      >
        <Stack spacing={3}>
          <RadioGroup onChange={onRoundChange} value={round}>
            <Box>{dayjs().format('YYYY년MM월')}</Box>
            <Stack direction="row">
              <Radio value="1">1회차</Radio>
              <Radio value="2">2회차</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      </ConfirmDialog>
    </Modal>
  );
}

function SettlementItemOptionDetail({
  settlementTarget,
  item,
}: {
  settlementTarget: SellerSettlementTarget;
  item: SellerSettlementTarget['items'][number];
}): JSX.Element {
  const commissionInfo = useSellCommission();

  // 이 옵션의 총 가격
  const totalPrice = useMemo(
    () => Number(item.orderItemOption.discountPrice) * item.orderItemOption.quantity,
    [item.orderItemOption.discountPrice, item.orderItemOption.quantity],
  );

  // 정산 정보를 등록했는 지 여부
  const isAbleToSettle =
    (settlementTarget.seller.sellerSettlementAccount || []).length > 0
      ? !!settlementTarget.seller.sellerSettlementAccount?.[0]
      : false;

  // 판매 유형
  const sellType = useMemo<'라이브쇼핑' | '상품홍보' | '기본판매'>(() => {
    if (item.orderItem.support.liveShopping) return '라이브쇼핑';
    if (item.orderItem.support.productPromotion) return '상품홍보';
    return '기본판매';
  }, [item.orderItem.support.liveShopping, item.orderItem.support.productPromotion]);

  return (
    <Grid
      my={4}
      borderWidth="thin"
      p={2}
      gridColumnGap={2}
      gridRowGap={1}
      templateColumns="1fr 2fr"
      gridAutoRows="minmax(20px, auto)"
    >
      <GridItem>상품 이미지</GridItem>
      <GridItem>
        {item.orderItem.goods.image && item.orderItem.goods.image.length > 0 && (
          <Image
            rounded="md"
            w={45}
            h={45}
            objectFit="cover"
            src={item.orderItem.goods.image[0].image}
          />
        )}
      </GridItem>

      <GridItem>상품이름</GridItem>
      <GridItem>
        <Text>{item.orderItem.goods.goods_name}</Text>
      </GridItem>

      <GridItem>상품옵션</GridItem>
      <GridItem>
        <Stack spacing={1}>
          {item.orderItemOption.name && item.orderItemOption.value ? (
            <Text>
              {item.orderItemOption.name}: {item.orderItemOption.value} (
              {`${getLocaleNumber(item.orderItemOption.discountPrice)}원`})
            </Text>
          ) : (
            <Text>{`${getLocaleNumber(item.orderItemOption.discountPrice)}원`}</Text>
          )}
        </Stack>
      </GridItem>

      <GridItem>주문 개수</GridItem>
      <Text>{getLocaleNumber(item.orderItemOption.quantity)}</Text>

      <GridItem>상품 가격 * 주문 개수</GridItem>
      <GridItem>{`${getLocaleNumber(totalPrice)}원`}</GridItem>

      <GridItem>결제방법</GridItem>
      <GridItem>{settlementTarget.order.payment?.method || '알 수 없음'}</GridItem>

      {/* <GridItem>전자결제수수료</GridItem>
      <GridItem>{`${
        pgCommission.commission
      }(${`${pgCommission.rate} ${pgCommission.description}`})`}</GridItem> */}

      <GridItem>판매 유형</GridItem>
      <GridItem>
        <Text
          fontWeight={['라이브쇼핑', '상품홍보'].includes(sellType) ? 'bold' : undefined}
          color={
            // eslint-disable-next-line no-nested-ternary
            sellType === '라이브쇼핑'
              ? 'green.500'
              : sellType === '상품홍보'
              ? 'blue.500'
              : undefined
          }
        >
          {sellType}
        </Text>
      </GridItem>

      <GridItem>판매 수수료</GridItem>
      <GridItem color="green.500">
        {item.orderItem.support.liveShopping && (
          <CommissionInfo
            totalPrice={totalPrice}
            broadcasterCommissionRate={
              item.orderItem.support.liveShopping?.broadcasterCommissionRate
            }
            whiletrueCommissionRate={
              item.orderItem.support.liveShopping?.whiletrueCommissionRate
            }
          />
        )}
        {item.orderItem.support.productPromotion && (
          <CommissionInfo
            totalPrice={totalPrice}
            broadcasterCommissionRate={
              item.orderItem.support.productPromotion?.broadcasterCommissionRate
            }
            whiletrueCommissionRate={
              item.orderItem.support.productPromotion?.whiletrueCommissionRate
            }
          />
        )}
        {item.orderItem.channel === SellType.normal &&
          !(
            item.orderItem.support.liveShopping || item.orderItem.support.productPromotion
          ) && (
            <Box>
              <Text>
                {commissionInfo.data && (
                  <CommissionInfo
                    totalPrice={totalPrice}
                    broadcasterCommissionRate="0"
                    whiletrueCommissionRate={commissionInfo.data.commissionRate}
                  />
                )}
              </Text>
            </Box>
          )}
        <Text />
      </GridItem>

      <GridItem>판매자</GridItem>
      <GridItem>
        <Box>
          <Text>{settlementTarget.seller?.email}</Text>
          <Text>{settlementTarget.seller?.name}</Text>
          <Text>{settlementTarget.seller?.sellerShop?.shopName}</Text>
        </Box>
      </GridItem>

      <GridItem>판매자 정산정보</GridItem>
      <GridItem>
        {!isAbleToSettle ? (
          <Text color="red.500">아직 정산정보 등록하지 않음</Text>
        ) : (
          <>
            {settlementTarget.seller.sellerSettlementAccount?.map((account) => (
              <Box key={account.id}>
                <Text>(은행) {account.bank}</Text>
                <Text>(계좌번호) {account.number}</Text>
                <Text>(예금주) {account.name}</Text>
                <Text>{account.settlementAccountImageName}</Text>
              </Box>
            ))}
          </>
        )}
      </GridItem>
    </Grid>
  );
}
