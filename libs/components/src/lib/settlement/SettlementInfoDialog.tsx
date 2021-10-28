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

export interface SettlementInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settlementInfo: SettlementDoneItem;
}
export function SettlementInfoDialog({
  isOpen,
  onClose,
  settlementInfo,
}: SettlementInfoDialogProps): JSX.Element {
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
              <Stack>
                <Text>총 수수료액</Text>
                <Text>{settlementInfo.totalCommission.toLocaleString()}</Text>
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
              <GridItem>
                <Text color={i.liveShoppingId ? 'green.500' : 'red.500'}>
                  {i.liveShoppingId ? 'O' : 'X'}
                </Text>
              </GridItem>
              <GridItem>방송인 수수료</GridItem>
              <GridItem>
                {i.broadcasterCommission.toLocaleString()} ({i.broadcasterCommissionRate}
                %)
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
  );
}
