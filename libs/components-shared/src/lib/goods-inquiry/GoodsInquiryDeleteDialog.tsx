/* eslint-disable react/no-array-index-key */
import { Box, Text, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useGoodsInquiryDeleteMutation, useProfile } from '@project-lc/hooks';
import { FindGoodsInquiryItem } from '@project-lc/shared-types';

export interface GoodsInquiryDeleteDialogProps {
  inquiry: FindGoodsInquiryItem;
  isOpen: boolean;
  onClose: () => void;
}
export function GoodsInquiryDeleteDialog({
  inquiry,
  isOpen,
  onClose,
}: GoodsInquiryDeleteDialogProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryDelete = useGoodsInquiryDeleteMutation();
  const handleDelete = async (): Promise<void> => {
    if (!profile) return undefined;
    if (!['admin', 'customer'].includes(profile.type)) return undefined;
    return goodsInquiryDelete
      .mutateAsync(inquiry.id)
      .then(() => {
        toast({ description: '상품 문의를 삭제하였습니다.', status: 'success' });
        onClose();
      })
      .catch(() => {
        toast({
          description:
            '상품 문의를 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status: 'error',
        });
      });
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="상품 문의 삭제"
      onConfirm={handleDelete}
      isLoading={goodsInquiryDelete.isLoading}
    >
      <Box textAlign="center">
        <Text>해당 상품 문의를 삭제하시겠습니까?</Text>
        <Text>작성된 답변도 모두 함께 삭제됩니다.</Text>
      </Box>
    </ConfirmDialog>
  );
}

export default GoodsInquiryDeleteDialog;
