import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Box,
  Stack,
  IconButton,
} from '@chakra-ui/react';
import { UserNotification } from '@prisma/client';
import { useNotificationMutation, useNotifications, useProfile } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { FaBell } from 'react-icons/fa';

/** 안읽음표시 */
function UnreadNotification(): JSX.Element {
  return <Box width="4px" height="4px" borderRadius="full" bgColor="red" />;
}

/** 개수 표시 배지 */
function CountBadge({ count }: { count: number }): JSX.Element {
  return (
    <Box
      as="span"
      color="white"
      position="absolute"
      top="0px"
      right="4px"
      fontSize="0.5rem"
      bgColor="red"
      borderRadius="full"
      p="0.5"
    >
      {count}
    </Box>
  );
}

/** 개인알림 제목, 내용, 읽음여부 표시하는 컴포넌트 */
function NotificationItem({ item }: { item: UserNotification }): JSX.Element {
  const { title, content, readFlag, createDate } = item;

  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">{title}</Text>
        {!readFlag && <UnreadNotification />}
      </Stack>
      <Text fontSize="xs">{dayjs(createDate).format('YYYY/MM/DD HH:mm')}</Text>
      <Text>{content}</Text>
    </Box>
  );
}

/** 알림버튼과 알림메시지 포함하는 컴포넌트 */
export function UserNotificationSection(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useNotifications(profileData?.email);

  const readNotification = useNotificationMutation();
  const markAsRead = (notification: UserNotification): void => {
    if (!profileData || notification.readFlag) return;

    readNotification
      .mutateAsync({
        id: notification.id,
        userEmail: profileData?.email,
        userType: process.env.NEXT_PUBLIC_APP_TYPE as UserType,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const unreadCount: number = useMemo(() => {
    if (!data) return 0;
    return data.filter((item) => item.readFlag === false).length;
  }, [data]);

  const hoverColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Menu isLazy closeOnSelect={false}>
      {/* 종모양 버튼 */}
      <MenuButton
        as={IconButton}
        variant="ghost"
        position="relative"
        icon={
          <>
            <FaBell color="gray.750" fontSize="1.2rem" />
            {unreadCount > 0 && <CountBadge count={unreadCount} />}
          </>
        }
      />

      <MenuList w={{ base: 280, sm: 400 }} minH={300} maxH={600} overflow="auto">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          pr={2}
          pb={2}
        >
          <Text fontSize="sm" color="gray.500">
            클릭시 읽음처리 됩니다
          </Text>
        </Stack>

        {/* 알림메시지 목록 */}
        {data &&
          data.map((noti) => (
            <Box
              cursor={noti.readFlag ? 'default' : 'pointer'}
              p={4}
              _hover={noti.readFlag ? undefined : { backgroundColor: hoverColor }}
              key={noti.id}
              onClick={() => {
                if (!noti.readFlag) markAsRead(noti);
              }}
            >
              <NotificationItem item={noti} />
            </Box>
          ))}
      </MenuList>
    </Menu>
  );
}

export default UserNotificationSection;
