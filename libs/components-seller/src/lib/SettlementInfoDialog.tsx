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
  Stack,
  Text,
} from '@chakra-ui/react';
import { SettlementDoneItem } from '@project-lc/hooks';
import { FmOrder } from '@project-lc/shared-types';
import { calcPgCommission } from '@project-lc/utils';
import { useMemo } from 'react';
import { LiveShopping, SellerSettlementItems } from '.prisma/client';

export interface SettlementInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settlementInfo: SettlementDoneItem;
}
/** 판매자 정산 상세 정보 */
export function SettlementInfoDialog({
  isOpen,
  onClose,
  settlementInfo,
}: SettlementInfoDialogProps): JSX.Element {
  const wtCommission = useMemo(
    () =>
      settlementInfo.settlementItems.reduce((acc, x) => {
        return acc + x.whiletrueCommission;
      }, 0),
    [settlementInfo.settlementItems],
  );
  const broadcasterCommission = useMemo(
    () =>
      settlementInfo.settlementItems.reduce((acc, x) => {
        return acc + x.broadcasterCommission;
      }, 0),
    [settlementInfo.settlementItems],
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>정산 대상 {settlementInfo.exportId} 상세정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(3, 1fr)" rowGap={4} mb={12}>
            <GridItem>
              <Stack>
                <Text>정산번호</Text>
                <Text>{settlementInfo.id}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text>출고번호</Text>
                <Text>{settlementInfo.exportId}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text> 출고코드</Text>
                <Text>{settlementInfo.exportCode}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text>총금액</Text>
                <Text>{settlementInfo.totalPrice.toLocaleString()}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={1}>
                <Text>수수료</Text>
                <Text fontSize="sm">
                  총수수료: {settlementInfo.totalCommission.toLocaleString()}
                </Text>
                <Text fontSize="sm">
                  전자결제수수료: {settlementInfo.pgCommission.toLocaleString()}
                </Text>
                {broadcasterCommission !== 0 && (
                  <Text fontSize="sm">
                    방송인수수료: {broadcasterCommission.toLocaleString()}
                  </Text>
                )}
                <Text fontSize="sm">크크쇼수수료: {wtCommission.toLocaleString()}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text>총 정산금액</Text>
                <Text>{settlementInfo.totalAmount.toLocaleString()}</Text>
              </Stack>
            </GridItem>
          </Grid>

          <Box>
            <Text fontWeight="bold">정산 상품 정보</Text>
          </Box>
          {settlementInfo.settlementItems.map((i) => (
            <SettlementInfoItem
              key={i.id}
              settlementItem={i}
              settlementInfo={settlementInfo}
            />
          ))}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface SettlementInfoItemProps {
  settlementInfo: SettlementDoneItem;
  settlementItem: SellerSettlementItems & {
    liveShopping: LiveShopping;
  };
}
export function SettlementInfoItem({
  settlementInfo,
  settlementItem,
}: SettlementInfoItemProps): JSX.Element {
  const pgCommission = useMemo(() => {
    const shippingCost = Number(settlementInfo.shippingCost);
    return calcPgCommission({
      targetAmount: settlementItem.price + shippingCost,
      paymentMethod: settlementInfo.paymentMethod as FmOrder['payment'],
      pg: settlementInfo.pg,
    });
  }, [
    settlementInfo.paymentMethod,
    settlementInfo.pg,
    settlementInfo.shippingCost,
    settlementItem.price,
  ]);

  const sellType = useMemo<'라이브쇼핑' | '상품홍보' | '기본판매'>(() => {
    if (settlementItem.liveShoppingId) return '라이브쇼핑';
    if (settlementItem.productPromotionId) return '상품홍보';
    return '기본판매';
  }, [settlementItem.liveShoppingId, settlementItem.productPromotionId]);

  return (
    <Grid
      key={settlementItem.id}
      my={4}
      p={2}
      borderWidth="thin"
      gridColumnGap={2}
      gridRowGap={1}
      templateColumns="1fr 2fr"
      gridAutoRows="minmax(20px, auto)"
    >
      {settlementItem.goods_image && (
        <>
          <GridItem>상품 이미지</GridItem>
          <GridItem>
            <Image
              w="50px"
              h="50px"
              src={`http://whiletrue.firstmall.kr${settlementItem.goods_image}`}
            />
          </GridItem>
        </>
      )}
      <GridItem>상품명</GridItem>
      <GridItem>
        <Box>
          {settlementItem.goods_name}
          {settlementItem.option_title && settlementItem.option1 && (
            <Text fontSize="sm">
              {settlementItem.option_title} : {settlementItem.option1}
            </Text>
          )}
        </Box>
      </GridItem>

      <GridItem>개수</GridItem>
      <GridItem>{settlementItem.ea}</GridItem>
      <GridItem>개당 가격</GridItem>
      <GridItem>{settlementItem.pricePerPiece.toLocaleString()}</GridItem>
      <GridItem>총 가격</GridItem>
      <GridItem>{settlementItem.price.toLocaleString()}</GridItem>
      <GridItem>판매 유형</GridItem>
      <GridItem>
        <Text
          fontWeight="bold"
          color={
            // eslint-disable-next-line no-nested-ternary
            settlementItem.liveShoppingId
              ? 'green.500'
              : settlementItem.productPromotionId
              ? 'blue.500'
              : undefined
          }
        >
          {sellType}
        </Text>
      </GridItem>

      <GridItem>전자결제수수료</GridItem>
      <GridItem>{`${pgCommission.commission.toLocaleString()} (${
        pgCommission.rate === '0'
          ? pgCommission.description
          : pgCommission.rate + pgCommission.description
      })`}</GridItem>
      {settlementItem.liveShoppingId || settlementItem.productPromotionId ? (
        <>
          <GridItem>방송인 수수료</GridItem>
          <GridItem>
            {settlementItem.broadcasterCommission.toLocaleString()} (
            {settlementItem.broadcasterCommissionRate}
            %)
          </GridItem>
        </>
      ) : null}
      <GridItem>크크쇼 수수료</GridItem>
      <GridItem>
        {settlementItem.whiletrueCommission.toLocaleString()} (
        {settlementItem.whiletrueCommissionRate}
        %)
      </GridItem>
    </Grid>
  );
}

export default SettlementInfoDialog;
