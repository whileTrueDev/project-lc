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
  Box,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { GridRowData } from '@material-ui/data-grid';
import {
  DiscountUnitTransformer,
  DiscountApplyFieldTransformer,
  DiscountApplyTypeTransformer,
} from '@project-lc/utils-frontend';

type AdminCouponListDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  data: GridRowData | undefined;
};

export function AdminCouponListDetailDialog(
  props: AdminCouponListDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose, data } = props;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상세보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && (
              <Flex direction="column" gap={3} minHeight={500}>
                <Flex direction="column">
                  <Text>쿠폰이름</Text>
                  <Text bgColor="yellow.100">{data.name}</Text>
                </Flex>
                <Flex direction="column">
                  <Text>할인방법</Text>
                  <Text bgColor="yellow.100">{DiscountUnitTransformer(data.unit)}</Text>
                </Flex>
                <Flex direction="column">
                  <Text>할인액(할인율)</Text>
                  <Text bgColor="yellow.100">{data.amount}</Text>
                </Flex>
                <Flex direction="column">
                  <Text>쿠폰 할인 영역</Text>
                  <Text bgColor="yellow.100">
                    {DiscountApplyFieldTransformer(data.applyField)}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text>할인 상품 범주</Text>
                  <Text bgColor="yellow.100">
                    {DiscountApplyTypeTransformer(data.applyType)}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text>시작날짜</Text>
                  <Text bgColor="yellow.100">
                    {dayjs(data.startDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text>종료날짜</Text>
                  <Text bgColor="yellow.100">
                    {dayjs(data.endDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text>최대할인금액</Text>
                  <Text bgColor="yellow.100">{data.maxDiscountAmountWon}</Text>
                </Flex>
                <Flex direction="column">
                  <Text>최소주문액</Text>
                  <Text bgColor="yellow.100">{data.minOrderAmountWon}</Text>
                </Flex>
                <Flex direction="column">
                  <Text>메모</Text>
                  <Text bgColor="yellow.100">{data.memo}</Text>
                </Flex>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
