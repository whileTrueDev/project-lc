import { useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useReviewCommentDeleteMutation } from '@project-lc/hooks';
import { GoodsReviewCommentItem, GoodsReviewItem } from '@project-lc/shared-types';

export interface ReviewCommentDeleteDialogProps {
  review: GoodsReviewItem;
  comment?: GoodsReviewCommentItem | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ReviewCommentDeleteDialog({
  review,
  comment,
  isOpen,
  onClose,
}: ReviewCommentDeleteDialogProps): JSX.Element {
  const toast = useToast();
  const { isLoading, mutateAsync } = useReviewCommentDeleteMutation();
  const handleDelete = async (): Promise<void> => {
    if (!comment) return undefined;
    return mutateAsync({ reviewId: review.id, commentId: comment.id })
      .then(() => {
        toast({ description: '리뷰 댓글을 삭제했습니다.', status: 'success' });
      })
      .catch((err) => {
        console.error(err);
        toast({
          description:
            '리뷰 댓글을 삭제하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
          status: 'error',
        });
      });
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="리뷰 댓글 삭제"
      onConfirm={handleDelete}
      isLoading={isLoading}
    >
      해당 리뷰 댓글을 삭제할까요?
    </ConfirmDialog>
  );
}

export default ReviewCommentDeleteDialog;
