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
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { GridRowData, GridColumns } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  DiscountUnitBage,
  DiscountApplyFieldBadge,
  DiscountApplyTypeBadge,
} from '@project-lc/components-shared/CouponBadge';

const columns: GridColumns = [
  { field: 'id', headerName: 'id', width: 10 },
  { field: 'goods_name', headerName: '상품명', flex: 1 },
  { field: 'category', headerName: '카테고리' },
];

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
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상세보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2,2fr)">
              <GridItem>
                {data && (
                  <Flex direction="column" gap={3} minHeight={500}>
                    <Flex direction="column">
                      <Text>쿠폰이름</Text>
                      <Text fontWeight="bold">{data.name}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>할인방법</Text>
                      {DiscountUnitBage(data.unit)}
                    </Flex>
                    <Flex direction="column">
                      <Text>할인액(할인율)</Text>
                      <Text fontWeight="bold">{data.amount}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>쿠폰 할인 영역</Text>
                      {DiscountApplyFieldBadge(data.applyField)}
                    </Flex>
                    <Flex direction="column">
                      <Text>할인 상품 범주</Text>
                      {DiscountApplyTypeBadge(data.applyType)}
                    </Flex>
                    <Flex direction="column">
                      <Text>시작날짜</Text>
                      <Text fontWeight="bold">
                        {dayjs(data.startDate).format('YYYY-MM-DD HH:mm:ss')}
                      </Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>종료날짜</Text>
                      <Text fontWeight="bold">
                        {data.endDate
                          ? dayjs(data.endDate).format('YYYY-MM-DD HH:mm:ss')
                          : '미정'}
                      </Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>최대할인금액</Text>
                      <Text fontWeight="bold">{data.maxDiscountAmountWon}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>최소주문액</Text>
                      <Text fontWeight="bold">{data.minOrderAmountWon}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text>메모</Text>
                      <Text fontWeight="bold">{data.memo}</Text>
                    </Flex>
                  </Flex>
                )}
              </GridItem>
              <GridItem>
                <Heading size="xs">연결된 상품</Heading>
                <ChakraDataGrid rows={data?.goods || []} columns={columns} minH={500} />
              </GridItem>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
