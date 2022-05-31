import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import {
  useReviewCommentUpdateMutation,
  useReviewCommentUpdateMutationDto,
} from '@project-lc/hooks';
import { GoodsReviewCommentItem } from '@project-lc/shared-types';
import { ReviewCommentCreateOrUpdateForm } from './ReviewCommentCreateOrUpdateForm';

export interface ReviewCommentUpdateDialogProps {
  comment?: GoodsReviewCommentItem | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ReviewCommentUpdateDialog({
  comment,
  isOpen,
  onClose,
}: ReviewCommentUpdateDialogProps): JSX.Element | null {
  const formId = 'reviewCommentCreateOrUpdate';
  const toast = useToast();
  const { isLoading, mutateAsync } = useReviewCommentUpdateMutation();
  const handleUpdate = async (dto: useReviewCommentUpdateMutationDto): Promise<void> => {
    mutateAsync(dto)
      .then(() => {
        toast({ description: '리뷰 댓글을 수정했습니다.', status: 'success' });
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast({
          description: '리뷰 댓글을 수정하는 중 오류가 발생했습니다.',
          status: 'error',
        });
      });
  };
  if (!comment) return null;
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>상품 리뷰 댓글 수정</ModalHeader>

        <ModalBody>
          <ReviewCommentCreateOrUpdateForm
            defaultValues={{
              commentId: comment.id,
              content: comment.content,
              reviewId: comment.reviewId,
              customerId: comment.customerId || undefined,
              sellerId: comment.sellerId || undefined,
            }}
            onSubmit={handleUpdate}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button form={formId} type="submit" colorScheme="blue" isLoading={isLoading}>
              수정
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReviewCommentUpdateDialog;
