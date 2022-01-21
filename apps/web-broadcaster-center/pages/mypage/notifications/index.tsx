import { Box } from '@chakra-ui/react';
import MypageLayout from '@project-lc/components-shared/MypageLayout';
import { UserNotificationList } from '@project-lc/components-shared/UserNotificationList';

export function Notifications(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster">
      <Box m="auto" maxWidth="2xl" p={6}>
        <UserNotificationList />
      </Box>
    </MypageLayout>
  );
}

export default Notifications;
