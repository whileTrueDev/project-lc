import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useBoolean,
  useColorModeValue,
} from '@chakra-ui/react';
import { UserNotification } from '@prisma/client';
import {
  Notifications,
  useNotificationMutation,
  useNotifications,
  useProfile,
} from '@project-lc/hooks';
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
function NotificationItem({
  item,
  onClick,
}: {
  item: UserNotification;
  onClick?: () => void;
}): JSX.Element {
  const { title, content, readFlag, createDate } = item;
  const hoverColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      cursor={readFlag ? 'default' : 'pointer'}
      _hover={readFlag ? undefined : { backgroundColor: hoverColor }}
      onClick={onClick}
      px={4}
    >
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">{title}</Text>
        {!readFlag && <UnreadNotification />}
      </Stack>
      <Text>{content}</Text>
      <Text fontSize="xs" color="gray.500">
        {dayjs(createDate).format('YYYY/MM/DD HH:mm')}
      </Text>
    </Box>
  );
}

function useNotificationState(data: Notifications | undefined): {
  unreadNotifications: UserNotification[];
  unreadCount: number;
  recentUnreadList: UserNotification[];
  wholeNotificationList: UserNotification[];
} {
  // 최근 미확인 알림 몇개 보여줄것인지
  const MAX_RECENT_UNREAD = 6;

  const unreadNotifications = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => item.readFlag === false);
  }, [data]);

  const unreadCount = useMemo(() => {
    return unreadNotifications.length;
  }, [unreadNotifications]);

  // 미확인 알림중 최근 MAX_RECENT_UNREAD개
  const recentUnreadList = useMemo(() => {
    return unreadNotifications.slice(0, MAX_RECENT_UNREAD);
  }, [unreadNotifications]);

  // 최근 미확인 알림 MAX_RECENT_UNREAD개 제외한 전체 알림목록
  const wholeNotificationList = useMemo(() => {
    if (!data) return [];
    const recentUnreadIds = recentUnreadList.map((unread) => unread.id);
    return data.filter((noti) => !recentUnreadIds.includes(noti.id));
  }, [data, recentUnreadList]);

  return {
    unreadNotifications,
    unreadCount,
    recentUnreadList,
    wholeNotificationList,
  };
}

/** 알림버튼과 알림메시지 포함하는 컴포넌트 */
export function UserNotificationSection(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useNotifications(profileData?.email);
  const { unreadCount, recentUnreadList, wholeNotificationList } =
    useNotificationState(data);

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

  const [wholeListOpen, { toggle, off }] = useBoolean();

  return (
    <Menu isLazy closeOnSelect={false} onClose={off}>
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

      <MenuList w={{ base: 280, sm: 400 }} maxH={600} overflow="auto">
        <Stack spacing={1}>
          {/* 미확인 알림 */}
          {recentUnreadList.length > 0 ? (
            <Stack>
              <Stack p={2} fontSize="sm" direction="row" alignItems="center">
                <Text>최근 미확인 알림메시지</Text>
                <Text fontSize="xs" color="gray.500">
                  (클릭시 읽음처리 됩니다)
                </Text>
              </Stack>

              {recentUnreadList.map((noti) => (
                <NotificationItem
                  key={noti.id}
                  item={noti}
                  onClick={() => markAsRead(noti)}
                />
              ))}
            </Stack>
          ) : (
            <Text textAlign="center" p={2}>
              새로운 알림이 없습니다.
            </Text>
          )}

          {wholeNotificationList.length > 0 && (
            <>
              {/* 전체 알림목록 보기 토글 버튼 */}
              <Center>
                <Button onClick={toggle} size="sm" my={2}>
                  <Text as="span">전체 알림 {wholeListOpen ? '닫기' : '보기'}</Text>
                  <Text fontSize="sm" color="gray.500">
                    (최근 30일 이내 알림만 볼 수 있습니다)
                  </Text>
                </Button>
              </Center>
              {/* (상단에 표시된 일부 미확인 알림 제외한)전체 알림메시지 목록 */}
              {wholeListOpen && (
                <Stack>
                  {wholeNotificationList.map((noti) => (
                    <>
                      <NotificationItem
                        key={noti.id}
                        item={noti}
                        onClick={() => markAsRead(noti)}
                      />
                      <Divider />
                    </>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </MenuList>
    </Menu>
  );
}

export default UserNotificationSection;
