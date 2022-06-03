/* eslint-disable react/no-array-index-key */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Image, Text, useDisclosure } from '@chakra-ui/react';
import { GoodsInquiryComment } from '@prisma/client';
import {
  useGoodsInquiryComments,
  useGoodsOutlineById,
  useProfile,
} from '@project-lc/hooks';
import {
  FindGoodsInquiryItem,
  GoodsInquiryCommentResItem,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
import CommentList from '../comment/CommentList';
import GoodsInquiryStatusBadge from '../GoodsInquiryStatusBadge';
import GoodsInquiryCommentCreateDialog from './GoodsInquiryCommentCreateDialog';
import GoodsInquiryCommentDeleteDialog from './GoodsInquiryCommentDeleteDialog';
import GoodsInquiryCommentUpdateDialog from './GoodsInquiryCommentUpdateDialog';
import GoodsInquiryDeleteDialog from './GoodsInquiryDeleteDialog';

export interface GoodsInquiryItemProps {
  inquiry: FindGoodsInquiryItem;
  deletable?: boolean;
}
export function GoodsInquiryItem({
  inquiry,
  deletable = false,
}: GoodsInquiryItemProps): JSX.Element {
  const createDialog = useDisclosure();
  const { data: profile } = useProfile();
  const goods = useGoodsOutlineById(inquiry.goodsId);
  const comments = useGoodsInquiryComments(inquiry.id);

  // 수정/삭제 타겟 답변
  const [targetComment, setTargetComment] = useState<null | GoodsInquiryComment>(null);
  const handleTargetComment = (_comment: GoodsInquiryCommentResItem): void => {
    setTargetComment({ ..._comment, adminId: null, goodsInquiryId: inquiry.id });
  };
  // 수정 다이얼로그
  const updateDialog = useDisclosure();
  const onCommentUpdate = (_comment: GoodsInquiryCommentResItem): void => {
    handleTargetComment(_comment);
    updateDialog.onOpen();
  };
  // 삭제 다이얼로그
  const deleteDialog = useDisclosure();
  const onCommentDelete = (_comment: GoodsInquiryCommentResItem): void => {
    handleTargetComment(_comment);
    deleteDialog.onOpen();
  };

  const deleteInquiryDialog = useDisclosure();
  return (
    <Box p={[2, 4]} borderWidth="thin" rounded="md" my={2}>
      {deletable && (
        <Box mb={2}>
          <Button
            colorScheme="red"
            size="xs"
            leftIcon={<DeleteIcon />}
            onClick={deleteInquiryDialog.onOpen}
          >
            문의삭제 {profile?.type === 'admin' && '(관리자 전용)'}
          </Button>

          {/* 개별 문의 삭제 다이얼로그 */}

          <GoodsInquiryDeleteDialog
            inquiry={inquiry}
            isOpen={deleteInquiryDialog.isOpen}
            onClose={deleteInquiryDialog.onClose}
          />
        </Box>
      )}
      <Flex justify="space-between" fontSize="sm">
        <Box>
          <GoodsInquiryStatusBadge goodsInquiryStatus={inquiry.status} />
          <Flex mt={1} gap={1} alignItems="center" fontSize="sm">
            <Image
              draggable={false}
              rounded="md"
              w={30}
              h={30}
              objectFit="cover"
              src={goods.data?.image[0].image}
            />
            <Text>{goods.data?.goods_name}</Text>
          </Flex>
          <Text>{dayjs(inquiry.createDate).format('YYYY년 MM월 DD일 HH:mm:ss')}</Text>
          <Text>{inquiry.writer.nickname}</Text>
        </Box>

        <Button size="sm" leftIcon={<EditIcon />} onClick={createDialog.onOpen}>
          답변생성
        </Button>
        <GoodsInquiryCommentCreateDialog
          inquiry={inquiry}
          isOpen={createDialog.isOpen}
          onClose={createDialog.onClose}
        />
      </Flex>

      <Box my={3}>
        <Text>{inquiry.content}</Text>
      </Box>

      <CommentList
        commentType="답변"
        comments={comments.data || []}
        onCommentDelete={(c) => onCommentDelete(c as GoodsInquiryCommentResItem)}
        onCommentUpdate={(c) => onCommentUpdate(c as GoodsInquiryCommentResItem)}
        isButtonSetVisible={(comment) => {
          const _comment = comment as GoodsInquiryCommentResItem;
          return !!(
            profile &&
            (profile.type === 'admin' || // 관리자거나
              // 로그인 유저가 판매자면서 답변이 해당 판매자가 직접 작성한 경우
              (profile.type === 'seller' && profile.id && _comment.sellerId))
          );
        }}
      />

      {/* 개별 답변 수정 다이얼로그 */}
      <GoodsInquiryCommentUpdateDialog
        isOpen={updateDialog.isOpen}
        onClose={updateDialog.onClose}
        inquiry={inquiry}
        comment={targetComment}
      />

      {/* 개별 답변 삭제 다이얼로그 */}
      <GoodsInquiryCommentDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        inquiry={inquiry}
        comment={targetComment}
      />
    </Box>
  );
}

export default GoodsInquiryItem;
