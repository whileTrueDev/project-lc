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
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  useLiveShoppingList,
  useProfile,
  useDeleteLiveShopping,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { LiveShoppingProgressConverter } from './LiveShoppingProgressConverter';
import { BroadcasterName } from './BroadcasterName';
import { ConfirmDialog } from './ConfirmDialog';

export function LiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useLiveShoppingList({
    enabled: !!profileData?.email,
  });

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
          toast({
            title: '삭제 완료하였습니다',
            status: 'error',
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
            <Th>유튜브영상</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            !isLoading &&
            data.map((row, index) => (
              <Tr key={row.id} onClick={() => handleDetailOnOpen(index)} cursor="pointer">
                <Td>{index + 1}</Td>
                <Td>{row.goods.goods_name}</Td>
                <Td>
                  <LiveShoppingProgressConverter
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
                <Td onClick={(e) => e.stopPropagation()}>
                  {row.liveShoppingVideo ? (
                    <Link
                      href={row.liveShoppingVideo.youtubeUrl}
                      isExternal
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      보러가기 <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    <Text>업로드 대기</Text>
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
                  <LiveShoppingProgressConverter
                    progress={data[liveShoppingId].progress}
                    broadcastStartDate={data[liveShoppingId].broadcastStartDate}
                    broadcastEndDate={data[liveShoppingId].broadcastEndDate}
                    sellEndDate={data[liveShoppingId].sellEndDate}
                  />
                  {data[liveShoppingId].progress === 'cancel' ? (
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
                  <Textarea resize="none" rows={10} readOnly>
                    {data[liveShoppingId].requests}
                  </Textarea>
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
