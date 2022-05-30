/* eslint-disable react/no-array-index-key */
import { useToast } from '@chakra-ui/react';
import { GoodsInquiryComment } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useGoodsInquiryCommentDeleteMutation, useProfile } from '@project-lc/hooks';
import { FindGoodsInquiryItem } from '@project-lc/shared-types';

export interface GoodsInquiryCommentDeleteDialogProps {
  inquiry: FindGoodsInquiryItem;
  comment?: GoodsInquiryComment | null;
  isOpen: boolean;
  onClose: () => void;
}
export function GoodsInquiryCommentDeleteDialog({
  inquiry,
  comment,
  isOpen,
  onClose,
}: GoodsInquiryCommentDeleteDialogProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryDelete = useGoodsInquiryCommentDeleteMutation();
  const handleDelete = async (): Promise<void> => {
    if (!profile) return undefined;
    if (!comment) return undefined;
    if (!['admin', 'seller'].includes(profile.type)) return undefined;

    return goodsInquiryDelete
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
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="문의 답변 삭제"
      onConfirm={handleDelete}
      isLoading={goodsInquiryDelete.isLoading}
    >
      해당 문의 답변을 삭제할까요?
    </ConfirmDialog>
  );
}

export default GoodsInquiryCommentDeleteDialog;
