/* eslint-disable react/no-array-index-key */
import { useToast } from '@chakra-ui/react';
import { GoodsInquiryComment } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useGoodsInquiryCommentDeleteMutation, useProfile } from '@project-lc/hooks';
import { FindGoodsInquiryItem } from '@project-lc/shared-types';

export interface SellerGoodsInquiryCommentDeleteDialogProps {
  inquiry: FindGoodsInquiryItem;
  comment?: GoodsInquiryComment | null;
  isOpen: boolean;
  onClose: () => void;
}
export function SellerGoodsInquiryCommentDeleteDialog({
  inquiry,
  comment,
  isOpen,
  onClose,
}: SellerGoodsInquiryCommentDeleteDialogProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryDelete = useGoodsInquiryCommentDeleteMutation();
  const handleDelete = async (): Promise<void> => {
    if (profile && comment) {
      goodsInquiryDelete
        .mutateAsync({ goodsInquiryCommentId: comment.id, goodsInquiryId: inquiry.id })
        .then(() => {
          toast({ description: '문의 답변을 삭제하였습니다.', status: 'success' });
          onClose();
        })
        .catch(() => {
          toast({
            description:
              '문의 답변을 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            status: 'error',
          });
        });
    }
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="문의 답변 삭제"
      onConfirm={handleDelete}
    >
      해당 문의 답변을 삭제할까요?
    </ConfirmDialog>
  );
}

export default SellerGoodsInquiryCommentDeleteDialog;
