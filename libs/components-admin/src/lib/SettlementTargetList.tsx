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
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useCreateSettlementMutation,
  useSellCommission,
  useSettlementTargets,
} from '@project-lc/hooks';
import {
  convertFmOrderPaymentsToString,
  FmSettlementTarget,
} from '@project-lc/shared-types';
import { calcPgCommission, checkOrderDuringLiveShopping } from '@project-lc/utils';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

/** 판매자 정산 대상 목록 */
export function SettlementTargetList(): JSX.Element | null {
  const dialog = useDisclosure();
  const targets = useSettlementTargets();

  const [selectedExport, setSelectedExport] = useState<FmSettlementTarget | null>(null);

  if (!targets.data) return null;
  return (
    <Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>출고번호</Th>
            <Th>출고코드</Th>
            <Th>판매자명</Th>
            <Th>구매자명</Th>
            <Th>수령자명</Th>
            <Th>결제방법</Th>
            <Th>출고날짜</Th>
            <Th>구매확정일</Th>
            <Th>출고에 포함된 상품 총금액</Th>
            <Th>배송비</Th>
            <Th>정산계좌등록여부</Th>
            <Th>자세히보기</Th>
          </Tr>
        </Thead>
        <Tbody>
          {targets.data.map((target) => {
            const totalPrice = target.options.reduce((acc, curr) => {
              if (!acc) return Number(curr.price) * curr.ea;
              return acc + Number(curr.price) * curr.ea;
            }, 0);

            // 정산 정보를 등록했는 지 여부
            const isAbleToSettle = target.options.every((opt) => {
              const ssa = opt.seller?.sellerSettlementAccount;
              if (ssa && ssa.length > 0) return true;
              return false;
            });
            return (
              <Tr key={target.export_seq}>
                <Td w="25px">{target.export_seq}</Td>
                <Td w="20px">{target.export_code}</Td>
                <Td w="100px">
                  {target.options[0].seller ? (
                    <Text isTruncated maxW="100px">
                      {target.options[0].seller.name}
                    </Text>
                  ) : (
                    <Text color="red.400">판매자 미상</Text>
                  )}
                </Td>
                <Td>{target.order_user_name}</Td>
                <Td>{target.recipient_user_name}</Td>
                <Td>{target.payment}</Td>
                <Td>{dayjs(target.export_date).format('YYYY/MM/DD HH:mm:ss')}</Td>
                <Td>
                  {target.buy_confirm && target.confirm_date
                    ? `${dayjs(target.confirm_date).format('YYYY/MM/DD')} by ${
                        target.buy_confirm
                      }`
                    : '-'}
                </Td>
                <Td>{totalPrice.toLocaleString()}</Td>
                <Td width="120px">
                  {target.shippingCostAlreadyCalculated
                    ? '이미 다른출고에 의해 정산됨'
                    : target.shipping_cost}
                </Td>
                <Td>{isAbleToSettle ? '정산등록함' : 'X'}</Td>
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
              </Tr>
            );
          })}
        </Tbody>
        {targets.data.length > 30 && (
          <Tfoot>
            <Tr>
              <Th>출고번호</Th>
              <Th>출고코드</Th>
              <Th>판매자명</Th>
              <Th>출고날짜</Th>
              <Th>구매확정일</Th>
              <Th>출고에 포함된 상품 총금액</Th>
              <Th>정산계좌등록여부</Th>
              <Th>자세히보기</Th>
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
  selectedSettleItem: FmSettlementTarget;
};
function SettlementItemInfoDialog({
  isOpen,
  onClose,
  selectedSettleItem,
}: SettlementItemInfoDialogProps): JSX.Element {
  const toast = useToast();
  const executeDialog = useDisclosure();
  const executeSettlement = useCreateSettlementMutation();

  const isAbleToSettle = selectedSettleItem.options.every((opt) => {
    const ssa = opt.seller?.sellerSettlementAccount;
    if (ssa && ssa.length > 0) return true;
    return false;
  });

  const [round, setRound] = useState<'1' | '2'>('1');
  const onRoundChange = (r: '1' | '2'): void => {
    setRound(r);
  };

  const onConfirm = async (): Promise<void> => {
    if (!selectedSettleItem.options[0].seller?.email) {
      toast({ title: '판매자 미상으로 정산처리 진행하지 못함', status: 'error' });
    } else {
      executeSettlement
        .mutateAsync({
          sellerEmail: selectedSettleItem.options[0].seller?.email,
          target: selectedSettleItem,
          round,
        })
        .then(() => {
          toast({
            title: `출고번호 ${selectedSettleItem.export_seq} 정산처리 완료`,
            status: 'success',
          });
          onClose();
        })
        .catch(() => {
          toast({ title: '정산처리 실패', status: 'error' });
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>정산 대상 {selectedSettleItem.export_code}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            배송비:{' '}
            {selectedSettleItem.shippingCostAlreadyCalculated
              ? '이미 다른출고에 의해 정산됨'
              : selectedSettleItem.shipping_cost}
          </Box>
          {selectedSettleItem.options.map((opt) => (
            <SettlementItemOptionDetail
              key={
                opt.export_code +
                opt.export_item_seq +
                opt.goods_seq +
                opt.item_option_seq
              }
              settlementTarget={selectedSettleItem}
              opt={opt}
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
        title={selectedSettleItem.export_code}
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
  opt,
}: {
  settlementTarget: FmSettlementTarget;
  opt: FmSettlementTarget['options'][number];
}): JSX.Element {
  const commissionInfo = useSellCommission();
  // 이 옵션의 총 가격
  const totalPrice = useMemo(() => Number(opt.price) * opt.ea, [opt.ea, opt.price]);

  // 정산 정보를 등록했는 지 여부
  const isAbleToSettle = useMemo(() => {
    const ssa = opt.seller?.sellerSettlementAccount;
    if (ssa && ssa.length > 0) return true;
    return false;
  }, [opt.seller?.sellerSettlementAccount]);

  const liveShopping = useMemo(() => {
    if (opt.LiveShopping.length === 0) return null;
    // 라이브쇼핑인지 여부
    // 판매된 시각과 라이브쇼핑 판매기간을 비교해 포함되면 라이브쇼핑을 통한 구매로 판단
    return opt.LiveShopping.find((lvs) => {
      return checkOrderDuringLiveShopping(settlementTarget, lvs);
    });
  }, [opt.LiveShopping, settlementTarget]);

  const commissionPrice = useMemo(() => {
    if (!liveShopping) {
      if (commissionInfo.data) {
        return Math.floor(Number(commissionInfo.data.commissionDecimal) * totalPrice);
      }
      return 0;
    }
    return 0;
  }, [commissionInfo.data, liveShopping, totalPrice]);

  const pgCommission = useMemo(() => {
    return calcPgCommission({
      paymentMethod: settlementTarget.payment,
      pg: settlementTarget.pg,
      targetAmount: totalPrice + Number(settlementTarget.shipping_cost),
    });
  }, [
    settlementTarget.payment,
    settlementTarget.pg,
    settlementTarget.shipping_cost,
    totalPrice,
  ]);

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
        {opt.image && <Image src={`http://whiletrue.firstmall.kr${opt.image}`} />}
      </GridItem>

      <GridItem>상품번호</GridItem>
      <GridItem>
        <Text>{opt.goods_seq}</Text>
      </GridItem>

      <GridItem>상품이름</GridItem>
      <GridItem>
        <Stack spacing={1}>
          <Text>{opt.goods_name}</Text>
          {opt.title1 && opt.option1 ? (
            <Text fontSize="sm">
              {opt.title1}: {opt.option1} ({`${Number(opt.price).toLocaleString()}원`})
            </Text>
          ) : (
            <Text>{`${Number(opt.price).toLocaleString()}원`}</Text>
          )}
        </Stack>
      </GridItem>

      <GridItem>주문 개수</GridItem>
      <Text>{opt.ea.toLocaleString()}</Text>

      <GridItem>상품 가격 * 주문 개수</GridItem>
      <GridItem>{`${totalPrice.toLocaleString()}원`}</GridItem>

      <GridItem>결제방법</GridItem>
      <GridItem>{convertFmOrderPaymentsToString(settlementTarget.payment)}</GridItem>

      <GridItem>pg</GridItem>
      <GridItem>{settlementTarget.pg || '-'}</GridItem>

      <GridItem>전자결제수수료</GridItem>
      <GridItem>{`${pgCommission.commission}(${
        pgCommission.rate + pgCommission.description
      }`}</GridItem>

      <GridItem>라이브쇼핑 주문 여부</GridItem>
      <GridItem>
        <Text
          fontWeight={liveShopping ? 'bold' : undefined}
          color={liveShopping ? 'green.500' : undefined}
        >
          {liveShopping ? 'O' : 'X'}
        </Text>
      </GridItem>

      <GridItem>판매 수수료</GridItem>
      <GridItem color="green.500">
        {liveShopping ? (
          <Box>
            <Text>
              방송인
              {liveShopping.broadcasterCommissionRate}% (
              {Math.floor(
                Number(liveShopping.broadcasterCommissionRate) * 0.01 * totalPrice,
              )}
              ) 원
            </Text>
            <Text>
              와일트루
              {liveShopping.whiletrueCommissionRate}% (
              {Math.floor(
                Number(liveShopping.whiletrueCommissionRate) * 0.01 * totalPrice,
              )}
              ) 원
            </Text>
          </Box>
        ) : (
          <Box>
            <Text>
              {commissionInfo.data &&
                `${commissionInfo.data.commissionRate}% (${commissionPrice}원)`}
            </Text>
          </Box>
        )}
        <Text />
      </GridItem>

      <GridItem>판매자</GridItem>
      <GridItem>
        {opt.seller ? (
          <Box>
            <Text>{opt.seller?.email}</Text>
            <Text>{opt.seller?.name}</Text>
            <Text>{opt.seller?.sellerShop?.shopName}</Text>
          </Box>
        ) : (
          <Box>
            <Text>-</Text>
          </Box>
        )}
      </GridItem>

      <GridItem>판매자 정산정보</GridItem>
      <GridItem>
        {!opt.seller && (
          <Text color="red.500">판매자 미상(상품 연결 정보 확인 필요)</Text>
        )}
        {opt.seller && !isAbleToSettle ? (
          <Text color="red.500">아직 정산정보 등록하지 않음</Text>
        ) : (
          <>
            {opt.seller?.sellerSettlementAccount.map((account) => (
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
