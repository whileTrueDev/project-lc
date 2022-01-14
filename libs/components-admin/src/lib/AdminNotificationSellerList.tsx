import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { useAdminNotifications, useAdminSellerList } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AdminNotificationTargetList } from './AdminNotificationTargetList';

/** 해당 유저에게 보냈던 메시지 확인 */
export function UserNotificationHistory({
  email,
  userType,
}: {
  email: string;
  userType: UserType;
}): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data, isLoading } = useAdminNotifications(isOpen, email, userType);
  return (
    <Box>
      <Button variant="link" onClick={onOpen}>
        {email}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>보낸 메세지 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading && <Spinner />}
            {data &&
              data.map((d) => (
                <Box key={d.id} py={2}>
                  <Text fontWeight="bold">{d.title}</Text>
                  <Text>{d.content}</Text>
                  <Text fontSize="xs">
                    {dayjs(d.createDate).format('YYYY-MM-DD HH:mm')}
                    <Text as="span"> - {d.readFlag ? '확인' : '미확인'}</Text>
                  </Text>
                  <Divider />
                </Box>
              ))}
            {!isLoading && data && data.length === 0 && (
              <Text>보낸 메시지가 없습니다</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

const sellerColumns: GridColumns = [
  { field: 'id', hide: true },
  {
    field: 'email',
    headerName: '판매자 이메일',
    renderCell: (params) => {
      return <UserNotificationHistory email={params.row.email} userType="seller" />;
    },
  },
  { field: 'name', headerName: '판매자 이름' },
  {
    field: 'shopName',
    headerName: '상점명',
    renderCell: (params) => <Text>{params.row.sellerShop?.shopName}</Text>,
  },
];

export function AdminNotificationSellerList(): JSX.Element {
  // 전체 판매자 목록
  const { data: userList } = useAdminSellerList();

  return (
    <AdminNotificationTargetList
      title="판매자"
      userType="seller"
      userList={userList}
      columns={sellerColumns}
      renderTarget={(user) => (
        <Text key={user.email}>
          - {user.name} ({user.sellerShop?.shopName})
        </Text>
      )}
    />
  );
}

export default AdminNotificationSellerList;
