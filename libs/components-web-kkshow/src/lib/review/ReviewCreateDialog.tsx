/* eslint-disable react/no-array-index-key */
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { Goods, OrderItem } from '@prisma/client';
import {
  useProfile,
  useReviewCreateMutation,
  useReviewUpdateMutationDto,
} from '@project-lc/hooks';
import { SubmitHandler } from 'react-hook-form';
import { ReviewCreateOrUpdateForm } from './ReviewCreateOrUpdateForm';

export interface ReviewCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goodsId: Goods['id'];
  orderItemId: OrderItem['id'];
}
export function ReviewCreateDialog({
  isOpen,
  onClose,
  goodsId,
  orderItemId,
}: ReviewCreateDialogProps): JSX.Element {
  const profile = useProfile();
  const toast = useToast();
  const reviewCreate = useReviewCreateMutation();
  const onSubmit: SubmitHandler<useReviewUpdateMutationDto> = async (data) => {
    if (!data.content || !data.rating) return null;
    if (!profile.data?.id) {
      toast({
        description: '후기는 로그인 이후 작성 가능합니다. 로그인 정보를 확인해보세요.',
        status: 'warning',
      });
      return null;
    }
    return reviewCreate
      .mutateAsync({
        content: data.content,
        images: data.images || [],
        rating: data.rating,
        goodsId,
        orderItemId,
        writerId: profile.data?.id,
      })
      .then(() => {
        onClose();
        toast({ description: '후기가 작성되었습니다.', status: 'success' });
      })
      .catch((err) => {
        console.log(err);
        toast({ description: '후기 작성 중 오류가 발생했습니다.', status: 'error' });
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
        <ModalHeader>후기 작성</ModalHeader>
        <ModalBody>
          <ReviewCreateOrUpdateForm onSubmit={onSubmit} onCancel={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReviewCreateDialog;
