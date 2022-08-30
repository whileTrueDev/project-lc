import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import {
  DiscountApplyFieldBadge,
  DiscountApplyTypeBadge,
} from '@project-lc/components-shared/CouponBadge';
import { CustomerCouponRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import CouponApplicableGoodsList from './CustomerCouponApplyGoodsList';

type CustomerCouponDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  customerCoupon: CustomerCouponRes;
};

export function CustomerCouponDetailDialog({
  isOpen,
  onClose,
  customerCoupon,
}: CustomerCouponDetailDialogProps): JSX.Element {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          {customerCoupon && (
            <>
              <ModalHeader>{customerCoupon.coupon.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Grid
                  gridTemplateColumns="repeat(4, 1fr)"
                  fontSize={{ base: 'sm', md: 'md' }}
                  rowGap={1}
                >
                  <GridItem>
                    <Text>
                      {customerCoupon.coupon.unit === 'P' ? '할인율' : '할인액'}
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.coupon.unit === 'P'
                        ? `${customerCoupon.coupon.amount}%`
                        : `${customerCoupon.coupon.amount.toLocaleString()}원`}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>할인유형</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    {DiscountApplyFieldBadge(customerCoupon.coupon.applyField)}
                  </GridItem>

                  <GridItem>
                    <Text>할인대상</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    {DiscountApplyTypeBadge(customerCoupon.coupon.applyType)}
                  </GridItem>

                  {/* 특정상품에만 적용가능한 쿠폰인 경우에만 표시 */}
                  {customerCoupon.coupon.applyType === 'selectedGoods' && (
                    <GridItem colSpan={4}>
                      <Text>적용 가능한 상품 목록</Text>

                      <CouponApplicableGoodsList
                        goodsList={customerCoupon.coupon.goods}
                        maxHeight="150px"
                      />
                    </GridItem>
                  )}

                  <GridItem>
                    <Text>최소주문액</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.coupon.minOrderAmountWon
                        ? `${customerCoupon.coupon.minOrderAmountWon.toLocaleString()}원`
                        : '-'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>최대할인액</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.coupon.maxDiscountAmountWon
                        ? `${customerCoupon.coupon.maxDiscountAmountWon.toLocaleString()}원`
                        : '-'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>할인시작일</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.coupon.startDate
                        ? dayjs(customerCoupon.coupon.startDate).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )
                        : '-'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>사용기한</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.coupon.endDate
                        ? dayjs(customerCoupon.coupon.endDate).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )
                        : '-'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>발급일</Text>
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Text>
                      {customerCoupon.issueDate
                        ? dayjs(customerCoupon.issueDate).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </Text>
                  </GridItem>
                </Grid>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>닫기</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
