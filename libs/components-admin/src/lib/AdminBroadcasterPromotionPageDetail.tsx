import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Link,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useAdminBroadcasterPromotionPageDeleteMutation } from '@project-lc/hooks';
import { BroadcasterPromotionPageData } from '@project-lc/shared-types';
import { useCallback } from 'react';
import AdminBroadcasterPromotionPageUpdateSection from './AdminBroadcasterPromotionPageUpdateSection';

export interface AdminBroadcasterPromotionPageDetailProps {
  pageData: BroadcasterPromotionPageData;
  promotionPageId: number;
  onDeleteSuccess: () => void;
}
export function AdminBroadcasterPromotionPageDetail({
  pageData,
  promotionPageId,
  onDeleteSuccess,
}: AdminBroadcasterPromotionPageDetailProps): JSX.Element {
  const toast = useToast();

  const { id, url, broadcaster, comment } = pageData;
  const { userNickname } = broadcaster;

  // 페이지 삭제
  const deleteDialog = useDisclosure();
  const deleteRequest = useAdminBroadcasterPromotionPageDeleteMutation();
  const onDeleteDialogConfirm = useCallback(async () => {
    deleteRequest.mutateAsync({ pageId: promotionPageId }).then((res) => {
      deleteDialog.onClose();
      toast({ title: '해당 방송인 상품홍보페이지를 삭제하였습니다', status: 'success' });
      onDeleteSuccess();
    });
  }, [deleteDialog, deleteRequest, onDeleteSuccess, promotionPageId, toast]);

  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Heading mt={4} size="lg">
          {userNickname}의 상품홍보페이지
        </Heading>
      </Stack>

      <ButtonGroup my={2} size="sm">
        <AdminBroadcasterPromotionPageUpdateSection pageData={pageData} />
        <Button leftIcon={<DeleteIcon />} onClick={deleteDialog.onOpen}>
          삭제
        </Button>
      </ButtonGroup>

      <Stack direction="row">
        <Text>페이지 고유ID : </Text>
        <Text>{id}</Text>
      </Stack>

      <Stack direction="row">
        <Text>방송인명 : </Text>
        <Text>{userNickname}</Text>
      </Stack>

      <Stack direction="row">
        <Text>방송인 소개글 : </Text>
        <Box borderWidth="thin" rounded="md" p={1}>
          {comment ? (
            <Text whiteSpace="break-spaces" fontSize={{ base: 'sm', md: 'md' }}>
              {comment}
            </Text>
          ) : (
            '-'
          )}
        </Box>
      </Stack>

      <Stack direction="row">
        <Text>url : </Text>
        {url && (
          <Link href={url} isExternal color="blue.500">
            {url} <ExternalLinkIcon mx="2px" />
          </Link>
        )}
      </Stack>

      {/* 상품홍보페이지 삭제 모달창 */}
      <ConfirmDialog
        title="상품홍보페이지 정보 삭제"
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={onDeleteDialogConfirm}
      >
        <Alert status="error">
          <AlertIcon />
          <Stack>
            <AlertTitle mr={2}>
              {userNickname}의 상품홍보페이지 정보를 삭제하시겠습니까?
            </AlertTitle>
            <AlertDescription>홍보중인 상품 정보 또한 모두 삭제됩니다</AlertDescription>
          </Stack>
        </Alert>
      </ConfirmDialog>
    </Box>
  );
}

export default AdminBroadcasterPromotionPageDetail;
