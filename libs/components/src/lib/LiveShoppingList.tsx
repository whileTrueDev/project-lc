import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  useAdminLiveShoppingList,
  useProfile,
  useDeleteLiveShopping,
} from '@project-lc/hooks';
import dayjs from 'dayjs';
import { LiveShoppingProgressConverter } from './LiveShoppingProgressConverter';
import { BroadcasterName } from './BroadcasterName';
import { ConfirmDialog } from './ConfirmDialog';

export function LiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [toDelete, setToDelete] = useState(0);
  const handleModalOpen = (liveShoppingId: number | null) => {
    console.log(liveShoppingId);
    // setIsOpen(true);
    // setToDelete(liveShoppingId);
  };
  const onClose = (): void => {
    setIsOpen(false);
  };
  const { mutateAsync } = useDeleteLiveShopping();
  const toast = useToast();

  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(1)
      .then((isDeleted) => {
        if (isDeleted) {
          toast({
            title: '삭제 완료하였습니다',
            status: 'error',
          });
          setIsOpen(false);
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
      <Heading size="md">라이브 쇼핑 리스트</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>등록일자</Th>
            <Th>상품명</Th>
            <Th>상점명</Th>
            <Th>상태</Th>
            <Th>방송인</Th>
            <Th>방송시작</Th>
            <Th>방송종료</Th>
            <Th>판매시작</Th>
            <Th>판매종료</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            !isLoading &&
            data.map((row, index) => (
              <Tr key={row.id}>
                <Td>{index}</Td>
                <Td>{dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}</Td>
                <Td>{row.goods.goods_name}</Td>
                <Td>{row.seller.sellerShop.shopName}</Td>
                <Td>
                  <LiveShoppingProgressConverter
                    progress={row.progress}
                    broadcastStartDate={row.broadcastStartDate}
                    broadcastEndDate={row.broadcastEndDate}
                    sellEndDate={row.sellEndDate}
                  />
                </Td>
                <Td>
                  <BroadcasterName data={row.broadcaster} />
                </Td>
                <Td>
                  {row.broadcastStartDate
                    ? dayjs(row.broadcastStartDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.broadcastEndDate
                    ? dayjs(row.broadcastEndDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.sellStartDate
                    ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.sellEndDate
                    ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.progress === 'registered' ? (
                    <Button
                      size="xs"
                      onClick={() => {
                        handleModalOpen(document.querySelector('data-row-key'));
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
