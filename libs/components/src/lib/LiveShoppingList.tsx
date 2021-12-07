import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Goods, GoodsConfirmation, LiveShopping, SellerShop } from '@prisma/client';
import {
  useDeleteLiveShopping,
  useFmOrdersDuringLiveShoppingSales,
  useLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';
import {
  BroadcasterDTOWithoutUserId,
  LIVE_SHOPPING_PROGRESS,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
// import { BroadcasterChannelButton } from '..';
import { BroadcasterName } from './BroadcasterName';
import { ConfirmDialog } from './ConfirmDialog';
import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';

export interface GoodsWithConfirmation extends Goods {
  confirmation: { confirmation: GoodsConfirmation };
}

export type LiveShoppingWithoutDate = Omit<LiveShopping, 'sellStartDate' | 'sellEndDate'>;

export interface LiveShoppingWithSalesFrontType extends LiveShoppingWithoutDate {
  sellStartDate: string | Date | undefined | null;
  sellEndDate: string | Date | undefined | null;
  sales?: string | null;
  broadcaster: BroadcasterDTOWithoutUserId;
  goods: Pick<GoodsWithConfirmation, 'goods_name' | 'summary'>;
  seller: { sellerShop: SellerShop };
  liveShoppingVideo: { youtubeUrl: string } | null;
}

export function LiveShoppingList(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();

  const { data, isLoading } = useLiveShoppingList({});
  const { data: sales, isLoading: isSalesLoading } = useFmOrdersDuringLiveShoppingSales({
    enabled: !!profileData?.email,
  });

  const liveShoppingWithSales: LiveShoppingWithSalesFrontType[] = [];

  if (data && sales) {
    for (let i = 0; i < data.length; i++) {
      liveShoppingWithSales.push({
        ...data[i],
        ...sales.find((itmInner) => itmInner.id === data[i].id),
      });
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  const [toDeleteLiveShoppingId, setToDeleteLiveShoppingId] = useState(0);
  const [liveShoppingId, setLiveShoppingId] = useState(0);
  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onClose: detailOnClose,
  } = useDisclosure();

  const handleDetailOnOpen = (id: number): void => {
    setLiveShoppingId(id);
    detailOnOpen();
  };

  const handleModalOpen = (id: number): void => {
    setIsOpen(true);
    setToDeleteLiveShoppingId(id);
  };

  const onClose = (): void => {
    setIsOpen(false);
  };

  const { mutateAsync } = useDeleteLiveShopping();
  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(toDeleteLiveShoppingId)
      .then((isDeleted) => {
        if (isDeleted) {
          toast({
            title: '삭제 완료하였습니다',
            status: 'success',
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          toast({
            title: '삭제 오류',
            description: error.response.data.message,
            status: 'error',
          });
        } else {
          toast({
            title: '삭제 오류',
            status: 'error',
          });
        }
      });
  };

  return (
    <Box p={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th />
            <Th>상품명</Th>
            <Th>상태</Th>
            <Th>방송인</Th>
            <Th width="15%">방송시간</Th>
            <Th width="15%">판매시간</Th>
            <Th>매출</Th>
            <Th>유튜브영상</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data &&
          data.length !== 0 &&
          !isLoading &&
          liveShoppingWithSales &&
          !isSalesLoading &&
          liveShoppingWithSales.length !== 0 ? (
            liveShoppingWithSales.map((row, index) => (
              <Tr key={row.id}>
                <Td>{index + 1}</Td>
                <Td>{row.goods.goods_name}</Td>
                <Td>
                  <LiveShoppingProgressBadge
                    progress={row.progress}
                    broadcastStartDate={row.broadcastStartDate}
                    broadcastEndDate={row.broadcastEndDate}
                    sellEndDate={row.sellEndDate}
                  />
                </Td>
                <Td onClick={(e) => e.stopPropagation()}>
                  <Flex alignItems="center">
                    <Box mr={1}>
                      <BroadcasterName data={row.broadcaster} />
                    </Box>
                    {/* //TODO: 방송인 계정설정 "플랫폼" 이후 channelUrl 전달 */}
                    {/* <BroadcasterChannelButton channelUrl={row.broadcaster?.channelUrl} /> */}
                  </Flex>
                </Td>
                <Td>
                  <Stack alignItems="center">
                    <Text>
                      {row.broadcastStartDate
                        ? dayjs(row.broadcastStartDate).format('YYYY/MM/DD HH:mm')
                        : '미정'}
                    </Text>
                    <Text>~</Text>
                    <Text>
                      {row.broadcastEndDate
                        ? dayjs(row.broadcastEndDate).format('YYYY/MM/DD HH:mm')
                        : '미정'}
                    </Text>
                  </Stack>
                </Td>
                <Td>
                  <Stack alignItems="center">
                    <Text>
                      {row.sellStartDate
                        ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
                        : '미정'}
                    </Text>
                    <Text>~</Text>
                    <Text>
                      {row.sellEndDate
                        ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm')
                        : '미정'}
                    </Text>
                  </Stack>
                </Td>
                <Td>
                  {row.sales ? row.sales.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}원
                </Td>
                <Td onClick={(e) => e.stopPropagation()}>
                  {row.liveShoppingVideo ? (
                    <Link
                      href={row.liveShoppingVideo?.youtubeUrl || ''}
                      isExternal
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      보러가기 <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    <Text> 업로드대기</Text>
                  )}
                </Td>
                <Td onClick={(e) => e.stopPropagation()}>
                  <Stack>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => handleDetailOnOpen(index)}
                    >
                      상세보기
                    </Button>

                    {row.progress === 'registered' ? (
                      <Button
                        size="xs"
                        colorScheme="orange"
                        onClick={() => {
                          handleModalOpen(row.id);
                        }}
                      >
                        삭제
                      </Button>
                    ) : null}
                  </Stack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td mt="10" colSpan={9}>
                <Center>새로운 라이브 쇼핑을 등록해주세요</Center>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {data &&
        data.length !== 0 &&
        !isLoading &&
        liveShoppingWithSales &&
        !isSalesLoading && (
          <Modal isOpen={detailIsOpen} onClose={detailOnClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>상세정보</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  {data[liveShoppingId]?.seller.sellerShop && (
                    <Text as="span">
                      판매자 : {data[liveShoppingId].seller.sellerShop.shopName}
                    </Text>
                  )}

                  <Stack direction="row" alignItems="center">
                    <Text as="span">진행상태</Text>
                    <LiveShoppingProgressBadge
                      progress={data[liveShoppingId].progress}
                      broadcastStartDate={data[liveShoppingId].broadcastStartDate}
                      broadcastEndDate={data[liveShoppingId].broadcastEndDate}
                      sellEndDate={data[liveShoppingId].sellEndDate}
                    />
                    {data[liveShoppingId].progress === LIVE_SHOPPING_PROGRESS.취소됨 ? (
                      <Text>사유 : {data[liveShoppingId].rejectionReason}</Text>
                    ) : null}
                  </Stack>
                  <Divider />
                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송인: </Text>
                    {data[liveShoppingId].broadcaster ? (
                      <>
                        <BroadcasterName data={data[liveShoppingId].broadcaster} />
                        {/* //TODO: 방송인 계정설정 "플랫폼" 이후 channelUrl 전달 */}
                        {/* {data[liveShoppingId].broadcaster.channelUrl && (
                          <BroadcasterChannelButton
                            channelUrl={data[liveShoppingId].broadcaster.channelUrl}
                          />
                        )} */}
                      </>
                    ) : (
                      <Text fontWeight="bold">미정</Text>
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송시작 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].broadcastStartDate
                        ? dayjs(data[liveShoppingId].broadcastStartDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송종료 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].broadcastEndDate
                        ? dayjs(data[liveShoppingId].broadcastEndDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Divider />
                  <Stack direction="row" alignItems="center">
                    <Text as="span">판매시작 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].sellStartDate
                        ? dayjs(data[liveShoppingId].sellStartDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">판매종료 시간: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].sellEndDate
                        ? dayjs(data[liveShoppingId].sellEndDate).format(
                            'YYYY/MM/DD HH:mm',
                          )
                        : '미정'}
                    </Text>
                  </Stack>

                  <Divider />
                  <Stack direction="row" alignItems="center">
                    <Text as="span">방송인 수수료: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].broadcasterCommissionRate
                        ? `${data[liveShoppingId].broadcasterCommissionRate}%`
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">판매 수수료: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].whiletrueCommissionRate
                        ? `${data[liveShoppingId].whiletrueCommissionRate}%`
                        : '미정'}
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">희망 판매 수수료: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].desiredCommission} %
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text as="span">희망 진행 기간: </Text>
                    <Text as="span" fontWeight="bold">
                      {data[liveShoppingId].desiredPeriod}
                    </Text>
                  </Stack>

                  <Stack>
                    <Text>요청사항</Text>
                    <Textarea
                      resize="none"
                      rows={10}
                      value={data[liveShoppingId].requests || ''}
                      readOnly
                    />
                  </Stack>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={detailOnClose}>
                  닫기
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

      <ConfirmDialog
        title="라이브 쇼핑 삭제"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteLiveShopping}
      >
        <Text>삭제하시겠습니까?</Text>
      </ConfirmDialog>
    </Box>
  );
}

export default LiveShoppingList;
