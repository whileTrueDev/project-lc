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
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { AdminSettlementDoneList, useAdminSettlementDoneList } from '@project-lc/hooks';
import { useState } from 'react';

export function SettlementDoneList(): JSX.Element | null {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { isLoading, data } = useAdminSettlementDoneList();

  const [selected, setSelected] = useState<AdminSettlementDoneList[number]>();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>정산번호</Th>
          <Th>출고번호</Th>
          <Th>출고코드</Th>
          <Th>총 정산상품 개수</Th>
          <Th>총 금액</Th>
          <Th>총 수수료액</Th>
          <Th>총정산금액</Th>
          <Th>자세히보기</Th>
        </Tr>
      </Thead>

      <Tbody>
        {data.map((history) => (
          <Tr key={history.id}>
            <Td>{history.id}</Td>
            <Td>{history.exportId}</Td>
            <Td>{history.exportCode}</Td>
            <Td>{history.totalEa}</Td>
            <Td>{history.totalPrice.toLocaleString()}</Td>
            <Td>{history.totalCommission.toLocaleString()}</Td>
            <Td>{history.totalAmount.toLocaleString()}</Td>
            <Td>
              <Button
                size="xs"
                onClick={() => {
                  onOpen();
                  setSelected(history);
                }}
              >
                자세히보기
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>

      {selected && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
          scrollBehavior="inside"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>정산 대상 {selected.exportId} 상세정보</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(3, 1fr)" rowGap={4} mb={12}>
                <GridItem>
                  <Stack>
                    <Text>정산번호</Text>
                    <Text>{selected.exportId}</Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack>
                    <Text>출고번호</Text>
                    <Text>{selected.exportId}</Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack>
                    <Text> 출고번호</Text>
                    <Text>{selected.exportId}</Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack>
                    <Text>총금액</Text>
                    <Text>{selected.totalPrice.toLocaleString()}</Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack>
                    <Text>총 수수료액</Text>
                    <Text>{selected.totalCommission.toLocaleString()}</Text>
                  </Stack>
                </GridItem>

                <GridItem>
                  <Stack>
                    <Text>총 정산금액</Text>
                    <Text>{selected.totalAmount.toLocaleString()}</Text>
                  </Stack>
                </GridItem>
              </Grid>

              <Box>
                <Text fontWeight="bold">정산 상품 정보</Text>
              </Box>
              {selected.settlementItems.map((i) => (
                <Grid
                  key={i.id}
                  my={4}
                  p={2}
                  borderWidth="thin"
                  gridColumnGap={2}
                  gridRowGap={1}
                  templateColumns="1fr 2fr"
                  gridAutoRows="minmax(20px, auto)"
                >
                  {i.goods_image && (
                    <>
                      <GridItem>상품 이미지</GridItem>
                      <GridItem>
                        <Image
                          w="50px"
                          h="50px"
                          src={`http://whiletrue.firstmall.kr${i.goods_image}`}
                        />
                      </GridItem>
                    </>
                  )}
                  <GridItem>상품명</GridItem>
                  <GridItem>
                    <Box>
                      {i.goods_name}
                      {i.option_title && i.option1 && (
                        <Text fontSize="sm">
                          {i.option_title} : {i.option1}
                        </Text>
                      )}
                    </Box>
                  </GridItem>

                  <GridItem>개수</GridItem>
                  <GridItem>{i.ea}</GridItem>
                  <GridItem>개당 가격</GridItem>
                  <GridItem>{i.pricePerPiece.toLocaleString()}</GridItem>
                  <GridItem>총 가격</GridItem>
                  <GridItem>{i.price.toLocaleString()}</GridItem>
                  <GridItem>라이브쇼핑 주문 여부</GridItem>
                  <GridItem>{i.liveShoppingId}</GridItem>
                  <GridItem>방송인 수수료</GridItem>
                  <GridItem>
                    {i.broadcasterCommission.toLocaleString()} (
                    {i.broadcasterCommissionRate}%)
                  </GridItem>
                  <GridItem>와일트루 수수료</GridItem>
                  <GridItem>
                    {i.whiletrueCommission.toLocaleString()} ({i.whiletrueCommissionRate}
                    %)
                  </GridItem>
                </Grid>
              ))}
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>닫기</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Table>
  );
}
