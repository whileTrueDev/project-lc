import { DeleteIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Flex,
  IconButton,
  Link,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { KkshowBcList } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';

import { useAdminKkshowBcListDeleteMutation, useKkshowBcList } from '@project-lc/hooks';
import { getKkshowWebHost } from '@project-lc/utils';
import NextLink from 'next/link';
import { useMemo } from 'react';

export function AdminKkshowBcList(): JSX.Element | null {
  const { data: broadcasters, isLoading } = useKkshowBcList();
  if (isLoading) return <Spinner />;
  if (!broadcasters) return null;
  return (
    <>
      {/* 현재 등록된 목록 */}
      {broadcasters.map((bc) => (
        <KkshowBcListBroadcaster key={bc.id} {...bc} />
      ))}
    </>
  );
}

export default AdminKkshowBcList;

type KkshowBcListBroadcasterProps = KkshowBcList;
export function KkshowBcListBroadcaster(bc: KkshowBcListBroadcasterProps): JSX.Element {
  const toast = useToast();
  const dialog = useDisclosure();
  const href = useMemo(() => {
    return bc.href.includes('http')
      ? bc.href
      : `${getKkshowWebHost()}${bc.href.startsWith('/') ? bc.href : `/${bc.href}`}`;
  }, [bc.href]);

  const { mutateAsync: deleteBc } = useAdminKkshowBcListDeleteMutation();
  const onRemoveClick = async (): Promise<void> => {
    return deleteBc({ id: bc.id })
      .then(() => {
        toast({ title: '방송인 목록에서 제거 성공', status: 'success' });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '방송인 목록에서 제거 실패',
          description: err.response?.data?.message,
          status: 'error',
        });
      });
  };

  return (
    <Flex key={bc.id} gap={2} align="center">
      <Avatar src={bc.profileImage} />
      <Text fontWeight="bold">{bc.nickname}</Text>
      <NextLink href={href} passHref>
        <Link isExternal>{href}</Link>
      </NextLink>
      <IconButton
        size="xs"
        aria-label="delete-bc-list"
        icon={<DeleteIcon />}
        onClick={dialog.onOpen}
      />
      <ConfirmDialog
        title={`${bc.nickname} 방송인을 목록에서 제거`}
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        onConfirm={onRemoveClick}
      >
        {bc.nickname} 방송인을 목록에서 제거하시겠습니까?
      </ConfirmDialog>
    </Flex>
  );
}
