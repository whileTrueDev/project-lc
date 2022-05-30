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
import { useGoodsInquiryCommentMutation, useProfile } from '@project-lc/hooks';
import { FindGoodsInquiryItem, GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { SubmitHandler } from 'react-hook-form';
import GoodsInquiryCommentForm from './GoodsInquiryCommentForm';

export interface GoodsInquiryCommentCreateDialogProps {
  inquiry: FindGoodsInquiryItem;
  isOpen: boolean;
  onClose: () => void;
}
export function GoodsInquiryCommentCreateDialog({
  inquiry,
  isOpen,
  onClose,
}: GoodsInquiryCommentCreateDialogProps): JSX.Element {
  const formId = 'goods-inquiry-comment-form';
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryCreate = useGoodsInquiryCommentMutation();
  const handleSubmit: SubmitHandler<GoodsInquiryCommentDto> = (formData) => {
    if (profile && ['admin', 'seller'].includes(profile.type)) {
      goodsInquiryCreate
        .mutateAsync({
          goodsInquiryId: inquiry.id,
          content: formData.content,
          sellerId: profile.type === 'seller' ? profile.id : undefined,
          adminId: profile.type === 'admin' ? profile.id : undefined,
        })
        .then(() => {
          toast({ description: '상품 문의 답변을 작성하였습니다.', status: 'success' });
          onClose();
        })
        .catch(() => {
          toast({
            description:
              '상품 문의 답변을 작성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
          상품 문의 답변 작성
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Box py={2}>
            <FormLabel>문의 내용</FormLabel>
            <Text fontSize="sm">{inquiry.writer.nickname}</Text>
            <Text fontSize="sm">{inquiry.content}</Text>
          </Box>
          <Divider />
          <GoodsInquiryCommentForm formId={formId} onSubmit={handleSubmit} />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button
              form={formId}
              type="submit"
              colorScheme="blue"
              isLoading={goodsInquiryCreate.isLoading}
            >
              생성
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GoodsInquiryCommentCreateDialog;
