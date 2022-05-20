/* eslint-disable react/no-array-index-key */
import { EditIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Center, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import MypageLayout from '@project-lc/components-shared/MypageLayout';
import { CommentList } from '@project-lc/components-web-kkshow/CommentList';
import {
  useGoodsInquiryComments,
  useGoodsOutlineById,
  useInfiniteGoodsInquiries,
  useProfile,
} from '@project-lc/hooks';
import { FindGoodsInquiryItem } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export function GoodsInquiries(): JSX.Element {
  return (
    <MypageLayout>
      <Box maxW="4xl" m="auto">
        <Text fontWeight="bold" fontSize="xl">
          상품 문의 관리
        </Text>
        <SellerGoodsInquiryList />
      </Box>
    </MypageLayout>
  );
}

export default GoodsInquiries;

function SellerGoodsInquiryList(): JSX.Element | null {
  const { data: profile } = useProfile();
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGoodsInquiries({ sellerId: profile?.id }, { enabled: !!profile?.id });

  if (!data) return null;
  return (
    <Box>
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

interface SellerGoodsInquiryListItemProps {
  inquiry: FindGoodsInquiryItem;
}
function SellerGoodsInquiryListItem({
  inquiry,
}: SellerGoodsInquiryListItemProps): JSX.Element {
  const { data: profile } = useProfile();
  const goods = useGoodsOutlineById(inquiry.goodsId);
  const comment = useGoodsInquiryComments(inquiry.id);

  const commentStatus = useMemo(() => {
    const result: string[] = [];
    const byMe = comment.data?.some((comm) => comm.sellerId === profile?.id);
    if (byMe) return result.concat('by-me');
    const byAdmin = comment.data?.some((c) => !!c.adminId);
    if (byAdmin) return result.concat('by-admin');
    return result;
  }, [comment.data, profile?.id]);

  return (
    <Box p={2} borderWidth="thin" rounded="md" my={2}>
      <Flex justify="space-between">
        <Box>
          <Flex alignItems="center" gap={1} flexWrap="wrap">
            {commentStatus.includes('by-me') && (
              <Badge variant="solid" colorScheme="green">
                답변 작성 완료
              </Badge>
            )}
            {commentStatus.includes('by-admin') && (
              <Badge variant="solid" colorScheme="orange">
                크크쇼관리자 답변 완료
              </Badge>
            )}
            {commentStatus.length === 0 && (
              <Badge variant="outline" colorScheme="gray">
                답변 필요
              </Badge>
            )}
          </Flex>
          <Text>{inquiry.writer.nickname}</Text>
          <Text>{dayjs(inquiry.createDate).format('YYYY년 MM월 DD일 HH:mm:ss')}</Text>
        </Box>

        <Button size="sm" leftIcon={<EditIcon />} onClick={() => alert('답변 생성')}>
          답변생성
        </Button>
      </Flex>

      <Flex mt={3} gap={1} alignItems="center">
        <Image
          rounded="md"
          w={30}
          h={30}
          objectFit="cover"
          src={goods.data?.image[0].image}
        />
        <Text>{goods.data?.goods_name}</Text>
      </Flex>

      <Box mt={3}>
        <Text>{inquiry.content}</Text>
      </Box>

      <CommentList commentType="답변" comments={comment.data || []} />
    </Box>
  );
}
