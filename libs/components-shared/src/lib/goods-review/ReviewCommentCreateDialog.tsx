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
import { GoodsReview } from '@prisma/client';
import {
  useProfile,
  useReviewCommentMutation,
  useReviewCommentUpdateMutationDto,
} from '@project-lc/hooks';
import { ReviewCommentCreateOrUpdateForm } from './ReviewCommentCreateOrUpdateForm';

export interface ReviewCommentCreateDialogProps {
  goodsReview: GoodsReview;
  isOpen: boolean;
  onClose: () => void;
}
export function ReviewCommentCreateDialog({
  goodsReview,
  isOpen,
  onClose,
}: ReviewCommentCreateDialogProps): JSX.Element | null {
  const formId = 'reviewCommentCreateOrUpdate';
  const toast = useToast();
  const { data: profile } = useProfile();
  const { isLoading, mutateAsync } = useReviewCommentMutation();
  const handleCreate = async (dto: useReviewCommentUpdateMutationDto): Promise<void> => {
    const { content } = dto;
    if (!profile) return undefined;
    return mutateAsync({
      content,
      reviewId: goodsReview.id,
      customerId: profile.type === 'customer' ? profile.id : undefined,
      sellerId: profile.type === 'seller' ? profile.id : undefined,
    })
      .then(() => {
        toast({ description: '리뷰 댓글을 작성했습니다.', status: 'success' });
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast({
          description: '리뷰 댓글을 작성하는 중 오류가 발생했습니다.',
          status: 'error',
        });
      });
  };
  if (!goodsReview) return null;
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>상품 리뷰 댓글 작성</ModalHeader>

        <ModalBody>
          <ReviewCommentCreateOrUpdateForm onSubmit={handleCreate} />
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button form={formId} type="submit" colorScheme="blue" isLoading={isLoading}>
              작성
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReviewCommentCreateDialog;
