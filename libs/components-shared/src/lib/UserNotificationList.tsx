import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { UserNotification } from '@prisma/client';
import {
  useAllNotificationReadMutation,
  useNotificationMutation,
  useNotifications,
  useProfile,
} from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { UnreadNotification } from './UserNotificationMenuButton';

export function UserNotificationList(): JSX.Element {
  const { data: profileData } = useProfile();
  // 전체 알림 조회 데이터
  const { isLoading, data: allNotifications } = useNotifications(profileData?.email);

  // 최근 30일 내 전체 알림목록
  const allNotificationList = useMemo(() => {
    if (!allNotifications) return [];
    return allNotifications;
  }, [allNotifications]);

  const allUnreadCount = useMemo(() => {
    return allNotificationList.filter((noti) => !noti.readFlag).length;
  }, [allNotificationList]);

  // 전체알림 읽음처리 함수
  const readAllNotification = useAllNotificationReadMutation();
  const readAll = (): void => {
    if (!profileData || !allUnreadCount) return;

    readAllNotification
      .mutateAsync({
        userEmail: profileData?.email,
        userType: process.env.NEXT_PUBLIC_APP_TYPE as UserType,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isLoading || !allNotifications) {
    return <Box>알림이 없습니다.</Box>;
  }

  return (
    <Stack maxW={600}>
      <Box>
        <Flex
          p={2}
          alignItems={['flex-start', 'center']}
          justify="space-between"
          flexDir={['column', 'row']}
          w="100%"
        >
          <Box>
            <Heading>최근 알림</Heading>
            <Text fontSize="sm">최근 30일 까지의 알림을 확인할 수 있습니다.</Text>
          </Box>
          <Button
            mt={[2, 0]}
            size="sm"
            leftIcon={<CheckIcon />}
            onClick={readAll}
            isDisabled={!allUnreadCount}
          >
            모두 읽음
          </Button>
        </Flex>

        {allNotifications.length > 0 ? (
          <>
            {allNotifications?.map((noti) => (
              <UserNotificationListItem key={noti.id} notification={noti} />
            ))}
          </>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            minH={100}
            textAlign="center"
            p={2}
          >
            <Text>아직 알림이 없습니다.</Text>
          </Flex>
        )}
      </Box>
    </Stack>
  );
}

export default UserNotificationList;

interface UserNotificationListItemProps {
  notification: UserNotification;
}
function UserNotificationListItem({
  notification,
}: UserNotificationListItemProps): JSX.Element {
  const hoverColor = useColorModeValue('gray.50', 'gray.600');
  const readNotification = useNotificationMutation();

  const markAsRead = (): void => {
    readNotification
      .mutateAsync({
        id: notification.id,
        userEmail: notification.userEmail,
        userType: process.env.NEXT_PUBLIC_APP_TYPE as UserType,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Flex
      borderBottomWidth="thin"
      cursor="default"
      _hover={{ backgroundColor: hoverColor }}
      w="100%"
      key={notification.id}
      p={2}
      flexDir="column"
    >
      <Flex flexDir={['column-reverse', 'row']} justify="space-between" gap={2}>
        <Box>
          {!notification.readFlag && <UnreadNotification />}
          <Text fontWeight="semibold">{notification.title}</Text>
          <Text fontWeight="normal">{notification.content}</Text>
        </Box>

        <Box textAlign="right">
          <Text fontSize="xs" color="gray.500">
            {dayjs(notification.createDate).format('YYYY/MM/DD HH:mm')}
          </Text>
          {!notification.readFlag && (
            <Button mt={2} size="xs" leftIcon={<CheckIcon />} onClick={markAsRead}>
              읽음처리
            </Button>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
