/* eslint-disable react/no-array-index-key */
import { DeleteIcon, EditIcon, Icon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Collapse, Flex, Text } from '@chakra-ui/react';
import {
  GoodsInquiryCommentRes,
  GoodsInquiryCommentResItem,
  GoodsReviewCommentItem,
  GoodsReviewCommentRes,
} from '@project-lc/shared-types';
import { useState } from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import 'suneditor/dist/css/suneditor.min.css';
import ReplyText from './ReplyText';

export interface CommentListProps {
  comments: GoodsReviewCommentRes | GoodsInquiryCommentRes;
  commentType?: '댓글' | '답변';
  isButtonSetVisible?: (
    comment: GoodsReviewCommentItem | GoodsInquiryCommentResItem,
  ) => boolean;
  onCommentUpdate?: (
    comment: GoodsReviewCommentItem | GoodsInquiryCommentResItem,
  ) => void;
  onCommentDelete?: (
    comment: GoodsReviewCommentItem | GoodsInquiryCommentResItem,
  ) => void;
}
export function CommentList({
  comments,
  commentType = '댓글',
  isButtonSetVisible,
  onCommentUpdate,
  onCommentDelete,
}: CommentListProps): JSX.Element | null {
  const [commentOpen, setCommentOpen] = useState(false);
  if (comments.length === 0) return null;
  return (
    <Box>
      <Text
        as="span"
        onClick={() => setCommentOpen(!commentOpen)}
        cursor="pointer"
        fontSize="sm"
        textDecor="underline"
      >
        {commentOpen ? `${commentType} 숨기기` : `${commentType} 보기`}
      </Text>

      <Collapse in={commentOpen}>
        <Box ml={6}>
          {comments.map((comment) => (
            <Flex key={comment.id} gap={2} my={2}>
              <Icon as={BsArrowReturnRight} mt={1} />
              <Box>
                {isButtonSetVisible && isButtonSetVisible(comment) && (
                  <ButtonGroup size="xs">
                    <Button
                      onClick={
                        onCommentUpdate ? () => onCommentUpdate(comment) : undefined
                      }
                      leftIcon={<EditIcon />}
                    >
                      수정
                    </Button>
                    <Button
                      onClick={
                        onCommentDelete ? () => onCommentDelete(comment) : undefined
                      }
                      leftIcon={<DeleteIcon />}
                    >
                      삭제
                    </Button>
                  </ButtonGroup>
                )}
                {comment.seller && (
                  <ReplyText
                    avatar={comment.seller.avatar || ''}
                    name={
                      comment.seller.sellerShop?.shopName || comment.seller.id.toString()
                    }
                    createDate={comment.createDate}
                    content={comment.content}
                  />
                )}
                {(comment as GoodsInquiryCommentResItem).admin && (
                  <ReplyText
                    avatar="" // 크크쇼 심볼 로고 추가 필요
                    name="크크쇼 관리자"
                    createDate={comment.createDate}
                    content={comment.content}
                  />
                )}
                {(comment as GoodsReviewCommentItem).customer && (
                  <ReplyText
                    avatar=""
                    name={(comment as GoodsReviewCommentItem).customer.nickname || ''}
                    createDate={comment.createDate}
                    content={comment.content}
                  />
                )}
              </Box>
            </Flex>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export default CommentList;
