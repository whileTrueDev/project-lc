import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  useToast,
  Link,
  Stack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Textarea,
  Center,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  useLiveShoppingList,
  useProfile,
  useDeleteLiveShopping,
  useFmOrdersDuringLiveShoppingSales,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { LiveShopping, Goods, GoodsConfirmation, SellerShop } from '@prisma/client';
import {
  BroadcasterDTOWithoutUserId,
  LIVE_SHOPPING_PROGRESS,
} from '@project-lc/shared-types';
import { useQueryClient } from 'react-query';
import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';
import { BroadcasterName } from './BroadcasterName';
import { ConfirmDialog } from './ConfirmDialog';

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
  const queryClient = useQueryClient();

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

  const toast = useToast();

  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(toDeleteLiveShoppingId)
      .then((isDeleted) => {
        if (isDeleted) {
          queryClient.invalidateQueries('LiveShoppingList');
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

  if (data?.length === 0) {
    return (
      <Box mt="10">
        <Center>새로운 라이브 쇼핑을 등록해주세요</Center>
      </Box>
    );
  }

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
            !isLoading &&
            liveShoppingWithSales &&
            !isSalesLoading &&
            liveShoppingWithSales.length !== 0 &&
            liveShoppingWithSales.map((row, index) => (
              <Tr key={row.id} onClick={() => handleDetailOnOpen(index)} cursor="pointer">
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
                  <Link href={row.broadcaster?.channelUrl} isExternal>
                    <BroadcasterName data={row.broadcaster} />
                  </Link>
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
                  {row.progress === 'registered' ? (
                    <Button
                      size="xs"
                      onClick={() => {
                        handleModalOpen(row.id);
                      }}
                    >
                      삭제
                    </Button>
                  ) : null}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      {data && !isLoading && (
        <Modal isOpen={detailIsOpen} onClose={detailOnClose} size="lg">
          <ModalContent>
            <ModalHeader>상세정보</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={5}>
                <Text as="span">
                  판매자 : {data[liveShoppingId].seller.sellerShop.shopName}
                </Text>

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
                    <Link href={data[liveShoppingId].broadcaster.channelUrl} isExternal>
                      <BroadcasterName data={data[liveShoppingId].broadcaster} />
                    </Link>
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
                      ? dayjs(data[liveShoppingId].sellEndDate).format('YYYY/MM/DD HH:mm')
                      : '미정'}
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
              <Button colorScheme="blue" mr={3} onClick={detailOnClose}>
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
