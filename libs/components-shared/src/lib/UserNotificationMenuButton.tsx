import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { UserNotification } from '@prisma/client';
import {
  useAllNotificationReadMutation,
  useNotificationMutation,
  useNotifications,
  useNotificationSubscription,
  useProfile,
  useRecentNotifications,
} from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FaBell } from 'react-icons/fa';
import CountBadge from './CountBadge';

/** 안읽음표시 */
export function UnreadNotification(): JSX.Element {
  return <Box width="4px" height="4px" borderRadius="full" bgColor="red" />;
}

/** 개인알림 제목, 내용, 읽음여부 표시하는 컴포넌트 */
export function NotificationItem({
  item,
  onClick,
}: {
  item: UserNotification;
  onClick?: () => void;
}): JSX.Element {
  const { title, content, readFlag, createDate } = item;
  const hoverColor = useColorModeValue('gray.50', 'gray.600');

  return (
    <Box
      cursor={readFlag ? 'default' : 'pointer'}
      _hover={{ backgroundColor: hoverColor }}
      onClick={onClick}
      p={2}
      px={4}
    >
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">{title}</Text>
        {!readFlag && <UnreadNotification />}
      </Stack>
      <Text fontWeight="normal">{content}</Text>
      <Text fontSize="xs" color="gray.500">
        {dayjs(createDate).format('YYYY/MM/DD HH:mm')}
      </Text>
    </Box>
  );
}

/** 알림버튼과 알림메시지 포함하는 컴포넌트 */
export function UserNotificationMenuButton(): JSX.Element {
  const router = useRouter();
  const { data: profileData } = useProfile();
  const toast = useToast();
  useNotificationSubscription((newNoti) => {
    toast({
      isClosable: true,
      variant: 'left-accent',
      title: newNoti.title,
      description: newNoti.content,
      status: 'info',
      position: 'top-right',
      containerStyle: {
        maxWidth: 320,
        maxHeight: '200px',
        height: '100%',
      },
    });
  });

  // 최근 알림 6개 조회 데이터
  const { data: partialNotifications } = useRecentNotifications(profileData?.email);

  const latestNotifications = useMemo(() => {
    if (!partialNotifications) return [];
    return partialNotifications;
  }, [partialNotifications]);

  const latestUnreadCount = useMemo(() => {
    return latestNotifications.filter((noti) => !noti.readFlag).length;
  }, [latestNotifications]);

  // 전체 알림 조회 데이터
  const { data: allNotifications } = useNotifications(profileData?.email);

  // 최근 30일 내 전체 알림목록
  const allNotificationList = useMemo(() => {
    if (!allNotifications) return [];
    return allNotifications;
  }, [allNotifications]);

  const allUnreadCount = useMemo(() => {
    return allNotificationList.filter((noti) => !noti.readFlag).length;
  }, [allNotificationList]);

  // 특정알림 읽음처리 함수
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

  return (
    <Menu isLazy closeOnSelect={false}>
      {/* 종모양 버튼 */}

      <Tooltip label="알림" fontSize="xs">
        <MenuButton
          as={IconButton}
          variant="ghost"
          position="relative"
          icon={
            <>
              <FaBell color="gray.750" fontSize="1.2rem" />
              {latestUnreadCount > 0 && <CountBadge count={latestUnreadCount} />}
            </>
          }
        />
      </Tooltip>

      <MenuList
        zIndex="banner" // sticky < banner < overlay
        w={{ base: 280, sm: 400 }}
        overflow="auto"
        cursor="default"
      >
        <Stack spacing={1}>
          {/* 알림메시지 존재하는 경우 */}
          <Box>
            <Stack
              pb={2}
              px={4}
              direction="row"
              justify="space-between"
              alignItems="center"
              borderBottomWidth="thin"
            >
              <Box>
                <Text fontWeight="medium">알림메시지</Text>
                <Text fontSize="xs" color="gray.500">
                  (클릭시 읽음처리 됩니다)
                </Text>
              </Box>

              <Button
                size="xs"
                leftIcon={<CheckIcon />}
                disabled={!allUnreadCount}
                onClick={readAll}
              >
                모두 읽음
              </Button>
            </Stack>

            {latestNotifications.length > 0 ? (
              <>
                <Stack overflow="auto" maxH={400} minH={200}>
                  {latestNotifications.map((noti) => (
                    <NotificationItem
                      key={noti.id}
                      item={noti}
                      onClick={() => markAsRead(noti)}
                    />
                  ))}
                </Stack>

                <Divider />

                {/* 전체 알림목록 보기 토글 버튼 */}
                <Box textAlign="center" p={2}>
                  <Button
                    size="sm"
                    variant="link"
                    fontWeight="medium"
                    onClick={() => router.push('/mypage/notifications')}
                  >
                    전체 알림 보기
                  </Button>
                </Box>
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
      </MenuList>
    </Menu>
  );
}

export default UserNotificationMenuButton;
