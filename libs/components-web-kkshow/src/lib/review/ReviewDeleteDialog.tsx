import { useToast } from '@chakra-ui/react';
import { GoodsReview } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useReviewDeleteMutation } from '@project-lc/hooks';

export interface ReviewDeleteDialogProps {
  reviewId: GoodsReview['id'];
  isOpen: boolean;
  onClose: () => void;
}
export function ReviewDeleteDialog({
  reviewId,
  onClose,
  isOpen,
}: ReviewDeleteDialogProps): JSX.Element {
  const toast = useToast();
  const deleteReview = useReviewDeleteMutation();
  const onDelete = async (): Promise<void> => {
    return deleteReview
      .mutateAsync({ reviewId })
      .then(() => {
        toast({ description: '리뷰가 삭제되었습니다.', status: 'success' });
      })
      .catch((err) => {
        console.log(err);
        toast({
          description: '리뷰를 삭제하는 도중 오류가 발생했습니다.',
          status: 'error',
        });
      });
  };
  return (
    <ConfirmDialog
      title={`리뷰 ${reviewId} 삭제`}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onDelete}
    >
      해당 리뷰 ({reviewId}) 를 삭제할까요?
    </ConfirmDialog>
  );
}

export default ReviewDeleteDialog;
