import { Text } from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { useAdminBroadcaster } from '@project-lc/hooks';
import { UserNotificationHistory } from './AdminNotificationSellerList';
import { AdminNotificationTargetList } from './AdminNotificationTargetList';

const broadcasterColumns: GridColumns = [
  { field: 'id', hide: true },
  {
    field: 'email',
    headerName: '방송인 이메일',
    renderCell: (params) => {
      return <UserNotificationHistory email={params.row.email} userType="broadcaster" />;
    },
  },
  { field: 'userNickname', headerName: '방송인 활동명' },
];

export function AdminNotificationBroadcasterList(): JSX.Element {
  // 전체 방송인 목록
  const { data: userList } = useAdminBroadcaster();

  return (
    <AdminNotificationTargetList
      title="방송인"
      userType="broadcaster"
      userList={userList}
      columns={broadcasterColumns}
      renderTarget={(user) => (
        <Text key={user.email}>
          - {user.email} ({user.userNickname})
        </Text>
      )}
    />
  );
}

export default AdminNotificationBroadcasterList;
