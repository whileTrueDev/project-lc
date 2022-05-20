/* eslint-disable react/no-array-index-key */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { CommentList } from '@project-lc/components-shared/comment/CommentList';
import {
  useGoodsInquiryComments,
  useGoodsOutlineById,
  useInfiniteGoodsInquiries,
  useProfile,
} from '@project-lc/hooks';
import {
  FindGoodsInquiryItem,
  GoodsInquiryCommentResItem,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import SellerGoodsInquiryCommentCreateDialog from './SellerGoodsInquiryCommentCreateDialog';
import SellerGoodsInquiryCommentDeleteDialog from './SellerGoodsInquiryCommentDeleteDialog';
import SellerGoodsInquiryCommentUpdateDialog from './SellerGoodsInquiryCommentUpdateDialog';

export function SellerGoodsInquiryList(): JSX.Element | null {
  const { data: profile } = useProfile();
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGoodsInquiries({ sellerId: profile?.id }, { enabled: !!profile?.id });

  if (!data) return null;
  return (
    <Box my={4}>
      {data?.pages[0].goodsInquiries.length === 0 && (
        <Text textAlign="center">문의 내역이 없습니다</Text>
      )}

      {data?.pages.map((page, idx) => (
        <Box key={idx}>
          {page.goodsInquiries.map((inq) => (
            <SellerGoodsInquiryListItem key={inq.id} inquiry={inq} />
          ))}
        </Box>
      ))}

      {hasNextPage && (
        <Center>
          <Button isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            더보기
          </Button>
        </Center>
      )}

      {isFetching && !isFetchingNextPage ? (
        <Center>
          <Spinner />
        </Center>
      ) : null}
    </Box>
  );
}
export default SellerGoodsInquiryList;

type GoodsInquiryStatus = Array<'by-me' | 'by-admin'>;
/** 상품문의 상태 조회 */
const useGoodsInquiryStatus = (inquiryId: GoodsInquiry['id']): GoodsInquiryStatus => {
  const comments = useGoodsInquiryComments(inquiryId);
  const { data: profile } = useProfile();
  /** 답변 상태 */
  const commentStatus = useMemo(() => {
    const result: GoodsInquiryStatus = [];
    const byMe = comments.data?.some((comm) => comm.sellerId === profile?.id);
    if (byMe) return result.concat('by-me');
    const byAdmin = comments.data?.some((c) => !!c.adminId);
    if (byAdmin) return result.concat('by-admin');
    return result;
  }, [comments.data, profile?.id]);

  return commentStatus;
};

export interface SellerGoodsInquiryListItemProps {
  inquiry: FindGoodsInquiryItem;
}
export function SellerGoodsInquiryListItem({
  inquiry,
}: SellerGoodsInquiryListItemProps): JSX.Element {
  const createDialog = useDisclosure();
  const { data: profile } = useProfile();
  const goods = useGoodsOutlineById(inquiry.goodsId);
  const comments = useGoodsInquiryComments(inquiry.id);

  /** 답변 달았는 지 상태 */
  const status = useGoodsInquiryStatus(inquiry.id);

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

  return (
    <Box p={[2, 4]} borderWidth="thin" rounded="md" my={2}>
      <Flex justify="space-between" fontSize="sm">
        <Box>
          <Flex alignItems="center" gap={1} flexWrap="wrap">
            {status.includes('by-me') && (
              <Badge variant="solid" colorScheme="green">
                답변 작성 완료
              </Badge>
            )}
            {status.includes('by-admin') && (
              <Badge variant="solid" colorScheme="orange">
                크크쇼관리자 답변 완료
              </Badge>
            )}
            {status.length === 0 && (
              <Badge variant="outline" colorScheme="gray">
                답변 필요
              </Badge>
            )}
          </Flex>
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
        <SellerGoodsInquiryCommentCreateDialog
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
        buttonSet={({ comment: c }): JSX.Element => {
          if (profile?.id && c.sellerId)
            return (
              <ButtonGroup size="xs">
                <Button
                  onClick={() => onCommentUpdate(c as GoodsInquiryCommentResItem)}
                  leftIcon={<EditIcon />}
                >
                  수정
                </Button>
                <Button
                  onClick={() => onCommentDelete(c as GoodsInquiryCommentResItem)}
                  leftIcon={<DeleteIcon />}
                >
                  삭제
                </Button>
              </ButtonGroup>
            );
          return <></>;
        }}
      />

      {/* 개별 답변 수정 다이얼로그 */}
      <SellerGoodsInquiryCommentUpdateDialog
        isOpen={updateDialog.isOpen}
        onClose={updateDialog.onClose}
        inquiry={inquiry}
        comment={targetComment}
      />

      {/* 개별 답변 삭제 다이얼로그 */}
      <SellerGoodsInquiryCommentDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        inquiry={inquiry}
        comment={targetComment}
      />
    </Box>
  );
}
