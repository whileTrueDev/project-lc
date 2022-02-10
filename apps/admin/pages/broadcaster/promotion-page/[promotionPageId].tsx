import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Link,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { AdminBroadcasterPromotionPageUpdateSection } from '@project-lc/components-admin/AdminBroadcasterPromotionPageUpdateSection';
import {
  useAdminBroadcasterPromotionPage,
  useAdminBroadcasterPromotionPageDeleteMutation,
  useAdminProductPromotion,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function BroadcasterPromotionPageDetail(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const goBackToList = useCallback(() => {
    router.push('/broadcaster/promotion-page');
  }, [router]);
  const promotionPageId = Number(router.query.promotionPageId);

  // 페이지 삭제
  const deleteDialog = useDisclosure();
  const deleteRequest = useAdminBroadcasterPromotionPageDeleteMutation();
  const onDeleteDialogConfirm = useCallback(async () => {
    deleteRequest.mutateAsync({ pageId: promotionPageId }).then((res) => {
      deleteDialog.onClose();
      toast({ title: '해당 방송인 상품홍보페이지를 삭제하였습니다', status: 'success' });
      goBackToList();
    });
  }, [deleteDialog, deleteRequest, goBackToList, promotionPageId, toast]);

  // 데이터
  const { data: listData, isLoading } = useAdminBroadcasterPromotionPage();
  const { data: productPromotionList } = useAdminProductPromotion(promotionPageId);

  if (isLoading) return <Text>로딩중...</Text>;

  const pageData = listData.find((item) => item.id === promotionPageId);
  if (!pageData)
    return (
      <AdminPageLayout>
        <Text>존재하지 않는 방송인 상품홍보페이지 입니다</Text>
        <Button onClick={goBackToList}>돌아가기</Button>
      </AdminPageLayout>
    );

  const { id, url, broadcaster } = pageData;
  const { userNickname } = broadcaster;
  return (
    <AdminPageLayout>
      <Box position="relative">
        <Button onClick={goBackToList}>돌아가기</Button>

        <Heading mt={4} size="lg">
          {userNickname}의 상품홍보페이지
        </Heading>

        <Stack direction="row">
          <Button onClick={deleteDialog.onOpen}>삭제</Button>
        </Stack>

        <Stack direction="row">
          <Text>페이지 id : </Text>
          <Text>{id}</Text>
        </Stack>

        <Stack direction="row">
          <Text>방송인명 : </Text>
          <Text>{userNickname}</Text>
        </Stack>

        <Stack direction="row">
          <Text>url : </Text>
          <Link href={url} isExternal color="blue.500">
            {url} <ExternalLinkIcon mx="2px" />
          </Link>
          <AdminBroadcasterPromotionPageUpdateSection pageData={pageData} />
        </Stack>

        <hr />
        <Stack direction="row">
          <Text>홍보중인 상품 : </Text>
          {productPromotionList && (
            <Box>
              {productPromotionList.map((item) => {
                return (
                  <Box key={item.id} {...boxStyle}>
                    <Link href={`/goods/${item.goodsId}`} color="blue.500">
                      상품명 : {item.goods.goods_name}
                    </Link>

                    <Stack direction="row">
                      <Text>와일트루 수수료 : {item.whiletrueCommissionRate} %</Text>
                    </Stack>
                    <Stack direction="row">
                      <Text>방송인 수수료 : {item.broadcasterCommissionRate} %</Text>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </Stack>
      </Box>

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
    </AdminPageLayout>
  );
}

export default BroadcasterPromotionPageDetail;
