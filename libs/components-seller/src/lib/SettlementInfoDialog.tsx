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
import SellTypeBadge from '@project-lc/components-shared/SellTypeBadge';
import { SettlementDoneItem } from '@project-lc/hooks';
import { calcPgCommission } from '@project-lc/utils';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { PaymentMethod } from '@prisma/client';
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
                <Text fontWeight="bold">정산번호</Text>
                <Text>{settlementInfo.id}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text fontWeight="bold">출고번호</Text>
                <Text>{settlementInfo.exportId}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text fontWeight="bold"> 출고코드</Text>
                <Text>{settlementInfo.exportCode}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text fontWeight="bold">총금액</Text>
                <Text>{getLocaleNumber(settlementInfo.totalPrice)}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack spacing={1}>
                <Text fontWeight="bold">수수료</Text>
                <Text fontSize="sm">
                  총수수료: {getLocaleNumber(settlementInfo.totalCommission)}
                </Text>
                <Text fontSize="sm">
                  전자결제수수료: {getLocaleNumber(settlementInfo.pgCommission)}
                </Text>
                {broadcasterCommission !== 0 && (
                  <Text fontSize="sm">
                    방송인수수료: {getLocaleNumber(broadcasterCommission)}
                  </Text>
                )}
                <Text fontSize="sm">크크쇼수수료: {getLocaleNumber(wtCommission)}</Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack>
                <Text fontWeight="bold">총 정산금액</Text>
                <Text>{getLocaleNumber(settlementInfo.totalAmount)}</Text>
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
      paymentMethod: settlementInfo.paymentMethod as PaymentMethod,
      pg: 'tossPayments',
    });
  }, [settlementInfo.paymentMethod, settlementInfo.shippingCost, settlementItem.price]);

  return (
    <Grid
      key={settlementItem.id}
      my={4}
      p={2}
      borderWidth="thin"
      borderRadius="xl"
      gridColumnGap={2}
      gridRowGap={1}
      templateColumns="1fr 2fr"
      gridAutoRows="minmax(20px, auto)"
    >
      {settlementItem.goods_image && (
        <>
          <GridItem fontWeight="bold">상품 이미지</GridItem>
          <GridItem>
            <Image
              w="50px"
              h="50px"
              rounded="md"
              objectFit="cover"
              src={settlementItem.goods_image}
            />
          </GridItem>
        </>
      )}
      <GridItem fontWeight="bold">상품명</GridItem>
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

      <GridItem fontWeight="bold">개수</GridItem>
      <GridItem>{settlementItem.ea}</GridItem>
      <GridItem fontWeight="bold">개당 가격</GridItem>
      <GridItem>{getLocaleNumber(settlementItem.pricePerPiece)}</GridItem>
      <GridItem fontWeight="bold">총 가격</GridItem>
      <GridItem>{getLocaleNumber(settlementItem.price)}</GridItem>
      <GridItem fontWeight="bold">판매 유형</GridItem>
      <GridItem>
        <SellTypeBadge sellType={settlementItem.sellType} />
      </GridItem>

      <GridItem fontWeight="bold">전자결제수수료</GridItem>
      <GridItem>{`${getLocaleNumber(pgCommission.commission)} (${
        pgCommission.rate === '0'
          ? pgCommission.description
          : pgCommission.rate + pgCommission.description
      })`}</GridItem>
      {settlementItem.liveShoppingId || settlementItem.productPromotionId ? (
        <>
          <GridItem fontWeight="bold">방송인 수수료</GridItem>
          <GridItem>
            {getLocaleNumber(settlementItem.broadcasterCommission)} (
            {settlementItem.broadcasterCommissionRate}
            %)
          </GridItem>
        </>
      ) : null}
      <GridItem fontWeight="bold">크크쇼 수수료</GridItem>
      <GridItem>
        {getLocaleNumber(settlementItem.whiletrueCommission)} (
        {settlementItem.whiletrueCommissionRate}
        %)
      </GridItem>
    </Grid>
  );
}

export default SettlementInfoDialog;
