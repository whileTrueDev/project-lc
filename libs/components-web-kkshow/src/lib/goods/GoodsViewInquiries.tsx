/* eslint-disable react/no-array-index-key */
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CommentList } from '@project-lc/components-shared/comment/CommentList';
import { GoodsInquiryDeleteDialog } from '@project-lc/components-shared/goods-inquiry/GoodsInquiryDeleteDialog';
import {
  useGoodsById,
  useGoodsInquiryComments,
  useGoodsInquiryDeleteMutation,
  useInfiniteGoodsInquiries,
  useProfile,
} from '@project-lc/hooks';
import { FindGoodsInquiryItem } from '@project-lc/shared-types';
import { asteriskify } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { GoodsInquiryFormDialog, GoodsInquiryPolicy } from './GoodsInquiryFormDialog';

export function GoodsViewInquiries(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  const inquiries = useInfiniteGoodsInquiries({ take: 5, goodsId: goods.data?.id });

  const formDialog = useDisclosure();
  if (!goods.data) return null;
  if (!inquiries.data) return null;
  return (
    <Box maxW="5xl" m="auto" id="goods-inquiries" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">상품 문의 목록</Text>

      <Box textAlign="right" my={2}>
        <Button size="sm" onClick={formDialog.onOpen}>
          문의하기
        </Button>
      </Box>

      <GoodsInquiryPolicy />

      <Divider />

      {inquiries.data.pages.map((page, idx) => (
        <Box key={idx}>
          {page.goodsInquiries.length === 0 && (
            <Box my={10}>
              <Text>아직 이 상품에 대한 문의가 없습니다.</Text>
            </Box>
          )}

          {page.goodsInquiries.map((inq) => (
            <Fragment key={inq.id}>
              <GoodsViewInquiryItem inquiry={inq} />
            </Fragment>
          ))}
        </Box>
      ))}

      {inquiries.hasNextPage && (
        <Box>
          <Button isLoading={inquiries.isLoading || inquiries.isFetchingNextPage}>
            더보기
          </Button>
        </Box>
      )}

      <Box>
        {inquiries.isFetching && !inquiries.isFetchingNextPage ? (
          <Center>
            <Spinner />
          </Center>
        ) : null}
      </Box>

      <GoodsInquiryFormDialog
        isOpen={formDialog.isOpen}
        onClose={formDialog.onClose}
        goodsId={goodsId}
      />
    </Box>
  );
}

interface GoodsViewInquiryItemProps {
  inquiry: FindGoodsInquiryItem;
}
function GoodsViewInquiryItem({ inquiry }: GoodsViewInquiryItemProps): JSX.Element {
  const profile = useProfile();
  const displayName = useMemo(() => {
    if (!inquiry.writer.nickname) return asteriskify(inquiry.writer.name);
    return inquiry.writer.nickname;
  }, [inquiry.writer.name, inquiry.writer.nickname]);

  const comments = useGoodsInquiryComments(inquiry.id);
  // 상품문의 삭제
  const deleteConfirmDialog = useDisclosure();
  const deleteMutation = useGoodsInquiryDeleteMutation();

  return (
    <>
      <Box my={4}>
        <Flex alignItems="center" gap={2}>
          {comments.data && comments.data.length > 0 && (
            <Badge colorScheme="blue" variant="solid">
              답변완료
            </Badge>
          )}
          <Text noOfLines={1}>
            <Text color="GrayText" as="span">
              {displayName}
            </Text>
            <Text color="GrayText" as="span">
              {' | '}
            </Text>
            <Text color="GrayText" as="span">
              {dayjs(inquiry.createDate).format('YYYY-MM-DD')}
            </Text>
          </Text>

          {/* 소비자 자기자신이 작성한 글인 경우만 삭제버튼 렌더링 */}
          {profile?.data?.type === 'customer' && profile?.data.id && inquiry.writerId && (
            <Box>
              <IconButton
                aria-label="goods-inquiry-delete-button"
                size="xs"
                icon={<DeleteIcon />}
                onClick={deleteConfirmDialog.onOpen}
              />
            </Box>
          )}
        </Flex>
        <Box mt={2}>
          <Text fontSize="sm" whiteSpace="break-spaces">
            {inquiry.content}
          </Text>
        </Box>
        <Box mt={2}>
          {comments.data && <CommentList comments={comments.data} commentType="답변" />}
        </Box>
      </Box>

      <GoodsInquiryDeleteDialog
        inquiry={inquiry}
        isOpen={deleteConfirmDialog.isOpen}
        onClose={deleteConfirmDialog.onClose}
      />

      <Divider />
    </>
  );
}
