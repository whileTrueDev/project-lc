import { Icon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { GridSelectionModel } from '@material-ui/data-grid';
import { useDeleteFmGoods, useDeleteLcGoods } from '@project-lc/hooks';
import { SellerGoodsListItem } from '@project-lc/shared-types';
import { useRef } from 'react';
import { useQueryClient } from 'react-query';

export function DeleteGoodsAlertDialog({
  onClose,
  isOpen,
  hasSelectedGoods,
  items,
  selectedGoodsIds,
}: {
  onClose: () => void;
  isOpen: boolean;
  hasSelectedGoods: boolean;
  items?: SellerGoodsListItem[];
  selectedGoodsIds: GridSelectionModel;
}): JSX.Element {
  const queryClient = useQueryClient();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  // Goods테이블에서 삭제요청
  const deleteLcGoods = useDeleteLcGoods();
  // fm-goods 테이블에서 삭제요청
  const deleteFmGoods = useDeleteFmGoods();

  // 삭제 다이얼로그에서 확인 눌렀을 때 상품삭제 핸들러
  const handleDelete = async () => {
    if (!items || !hasSelectedGoods) return;
    // 검수된 상품
    const confirmedGoods = items.filter(
      (item) =>
        selectedGoodsIds.includes(item.id) &&
        item.confirmation &&
        item.confirmation.status === 'confirmed' &&
        item.confirmation.firstmallGoodsConnectionId !== null,
    );

    try {
      // 전체 선택된 상품 Goods테이블에서 삭제요청
      const deleteGoodsFromLcDb = deleteLcGoods.mutateAsync({
        ids: selectedGoodsIds.map((id) => Number(id)),
      });
      // 선택된 상품 중 검수된 상품은 fm-goods 테이블에서 삭제요청
      const deleteGoodsFromFmDb = deleteFmGoods.mutateAsync({
        ids: confirmedGoods.map((item) => Number(item.id)),
      });
      await Promise.all([deleteGoodsFromLcDb, deleteGoodsFromFmDb]);
      queryClient.invalidateQueries('SellerGoodsList');
      toast({
        title: '상품이 삭제되었습니다',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: '상품 삭제 중 오류가 발생하였습니다',
        status: 'error',
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <Text>
              <Icon as={WarningTwoIcon} color="red.500" mr={2} />
              상품 삭제
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            {!hasSelectedGoods
              ? '삭제할 상품을 선택해주세요'
              : '상품 삭제시 복구가 불가합니다. 선택한 상품을 삭제하시겠습니까?'}
          </AlertDialogBody>

          <AlertDialogFooter>
            {hasSelectedGoods && <Button onClick={onClose}>취소</Button>}
            <Button
              onClick={!hasSelectedGoods ? onClose : handleDelete}
              ml={3}
              colorScheme={!hasSelectedGoods ? undefined : 'red'}
              isLoading={deleteLcGoods.isLoading || deleteFmGoods.isLoading}
            >
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default DeleteGoodsAlertDialog;
