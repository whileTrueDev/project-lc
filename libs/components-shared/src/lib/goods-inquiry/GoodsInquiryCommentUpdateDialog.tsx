/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { GoodsInquiryComment } from '@prisma/client';

import { useGoodsInquiryCommentUpdateMutation, useProfile } from '@project-lc/hooks';
import { FindGoodsInquiryItem, GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { SubmitHandler } from 'react-hook-form';
import GoodsInquiryCommentForm from './GoodsInquiryCommentForm';

export interface GoodsInquiryCommentUpdateDialogProps {
  inquiry: FindGoodsInquiryItem;
  comment?: GoodsInquiryComment | null;
  isOpen: boolean;
  onClose: () => void;
}
export function GoodsInquiryCommentUpdateDialog({
  comment,
  inquiry,
  isOpen,
  onClose,
}: GoodsInquiryCommentUpdateDialogProps): JSX.Element {
  const formId = 'goods-inquiry-comment-form';
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryUpdate = useGoodsInquiryCommentUpdateMutation();
  const handleSubmit: SubmitHandler<GoodsInquiryCommentDto> = (formData) => {
    if (profile && comment && ['admin', 'seller'].includes(profile.type)) {
      goodsInquiryUpdate
        .mutateAsync({
          goodsInquiryCommentId: comment.id,
          goodsInquiryId: inquiry.id,
          content: formData.content,
          sellerId: profile.type === 'seller' ? profile.id : undefined,
          adminId: profile.type === 'admin' ? profile.id : undefined,
        })
        .then(() => {
          toast({ description: '문의 답변을 수정하였습니다.', status: 'success' });
          onClose();
        })
        .catch(() => {
          toast({
            description:
              '문의 답변 수정하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            status: 'error',
          });
        });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          상품 문의 답변 수정
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Box py={2}>
            <FormLabel>문의 내용</FormLabel>
            <Text fontSize="sm">{inquiry.writer.nickname}</Text>
            <Text fontSize="sm">{inquiry.content}</Text>
          </Box>
          <Divider />
          <GoodsInquiryCommentForm
            formId={formId}
            onSubmit={handleSubmit}
            defaultValues={{ content: comment?.content }}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button
              form={formId}
              type="submit"
              colorScheme="blue"
              isLoading={goodsInquiryUpdate.isLoading}
            >
              수정
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GoodsInquiryCommentUpdateDialog;
