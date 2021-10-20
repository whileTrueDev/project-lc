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
  Link,
  Stack,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
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
  const [liveShoppingId, setLiveShoppingId] = useState(0);
  const handleModalOpen = (id: number): void => {
    setIsOpen(true);
    setLiveShoppingId(id);
  };

  const onClose = (): void => {
    setIsOpen(false);
  };

  const { mutateAsync } = useDeleteLiveShopping();

  const toast = useToast();

  const deleteLiveShopping = async (): Promise<void> => {
    mutateAsync(liveShoppingId)
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
      <Heading size="md">라이브 쇼핑 리스트</Heading>
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
              <Tr key={row.id}>
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
                <Td align="center">
                  <BroadcasterName data={row.broadcaster} />
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
                  {row.liveShoppingVideo.youtubeUrl ? (
                    <Link
                      href={row.liveShoppingVideo.youtubeUrl}
                      isExternal
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      보러가기 <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : null}
                </Td>
                <Td>
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
