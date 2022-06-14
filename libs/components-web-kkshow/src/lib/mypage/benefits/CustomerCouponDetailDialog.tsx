import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { GridRowData } from '@material-ui/data-grid';
import {
  DiscountApplyFieldBadge,
  DiscountApplyTypeBadge,
} from '@project-lc/components-shared/CouponBadge';

type CustomerCouponDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  data: GridRowData;
};

export function CustomerCouponDetailDialog(
  props: CustomerCouponDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose, data } = props;
  const { coupon } = data;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {coupon && (
            <>
              <ModalHeader>{coupon.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex direction="column" justifyContent="space-evenly" minH={250}>
                  <Flex justifyContent="space-between">
                    <Text>{coupon.unit === 'P' ? '할인율' : '할인액'}</Text>
                    <Text>
                      {coupon.unit === 'P'
                        ? `${coupon.amount}%`
                        : `${coupon.amount.toLocaleString()}원`}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>할인유형</Text>
                    <Text>{DiscountApplyFieldBadge(coupon.applyField)}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>할인대상</Text>
                    <Text>{DiscountApplyTypeBadge(coupon.applyType)}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>최소주문액</Text>
                    <Text>
                      {coupon.minOrderAmountWon
                        ? `${coupon.minOrderAmountWon.toLocaleString()}원`
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>최대할인액</Text>
                    <Text>
                      {coupon.maxDiscountWon
                        ? `${coupon.maxDiscountWon.toLocaleString()}원`
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>할인시작일</Text>
                    <Text>
                      {coupon.startDate
                        ? dayjs(coupon.startDate).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>사용기한</Text>
                    <Text>
                      {coupon.endDate
                        ? dayjs(coupon.endDate).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>발급일</Text>
                    <Text>
                      {data.issueDate
                        ? dayjs(data.issueDate).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </Text>
                  </Flex>
                </Flex>
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
