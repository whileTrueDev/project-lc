/* eslint-disable react/no-array-index-key */
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { GoodsReview } from '@prisma/client';
import { useReviewUpdateMutation, useReviewUpdateMutationDto } from '@project-lc/hooks';
import { GoodsReviewItem } from '@project-lc/shared-types';
import { SubmitHandler } from 'react-hook-form';
import { ReviewCreateOrUpdateForm } from './ReviewCreateOrUpdateForm';

export interface ReviewUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: GoodsReview['id'];
  review: GoodsReviewItem;
}
export function ReviewUpdateDialog({
  isOpen,
  onClose,
  reviewId,
  review,
}: ReviewUpdateDialogProps): JSX.Element {
  const toast = useToast();

  const reviewUpdate = useReviewUpdateMutation();
  const onSubmit: SubmitHandler<useReviewUpdateMutationDto> = async (data) => {
    return reviewUpdate
      .mutateAsync({
        reviewId: review.id,
        content: data.content,
        images: data.images,
        rating: data.rating,
      })
      .then(() => {
        onClose();
        toast({ description: '후기가 수정되었습니다.', status: 'success' });
      })
      .catch((err) => {
        console.log(err);
        toast({ description: '후기 수정 중 오류가 발생했습니다.', status: 'error' });
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>후기 {reviewId} 수정하기</ModalHeader>
        <ModalBody>
          <ReviewCreateOrUpdateForm
            onSubmit={onSubmit}
            defaultValues={{
              content: review.content,
              images: review.images,
              rating: review.rating,
            }}
            onCancel={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReviewUpdateDialog;
