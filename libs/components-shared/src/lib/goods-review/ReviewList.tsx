/* eslint-disable react/no-array-index-key */
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import StarRating from '@project-lc/components-core/StarRating';
import {
  useGoodsById,
  useGoodsReviewComments,
  useInfiniteReviews,
  useProfile,
  useResizedImage,
} from '@project-lc/hooks';
import {
  FindManyGoodsReviewDto,
  GoodsReviewCommentItem,
  GoodsReviewItem,
} from '@project-lc/shared-types';
import { asteriskify } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import CommentList from '../comment/CommentList';
import GoodsDisplay2 from '../goods/GoodsDisplay2';
import ReviewCommentCreateDialog from './ReviewCommentCreateDialog';
import ReviewCommentDeleteDialog from './ReviewCommentDeleteDialog';
import ReviewCommentUpdateDialog from './ReviewCommentUpdateDialog';
import ReviewDeleteDialog from './ReviewDeleteDialog';
import ReviewUpdateDialog from './ReviewUpdateDialog';

export interface ReviewListProps extends Omit<ReviewDetailProps, 'review'> {
  /** 리뷰 목록 정보 불러올 때 적용할 파라미터 */
  dto: FindManyGoodsReviewDto;
  /** 리뷰목록정보 불러오는 작업을 언제 적용할 지 여부, 기본값 true로, 입력하지 않으면 항시 불러옴. */
  enabled?: boolean;
  /** 목록 필터링 함수. 해당 함수를 통과한 목록만 보여지게 됨 */
  filterFn?: Parameters<Array<GoodsReviewItem>['filter']>[0];
}
export function ReviewList({
  dto,
  enabled,
  filterFn,
  ...rest
}: ReviewListProps): JSX.Element | null {
  const reviews = useInfiniteReviews(dto, enabled);
  if (reviews.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!reviews.data) return null;

  return (
    <Box>
      {reviews.data.pages.map((page, idx) => (
        <Box key={idx}>
          {page.reviews.length === 0 && (
            <Box my={10}>
              <Text>아직 작성한 후기가 없습니다.</Text>
            </Box>
          )}

          {page.reviews.filter(filterFn || ((r) => r)).map((review) => (
            <ReviewDetail key={review.id} review={review} {...rest} />
          ))}

          {reviews.hasNextPage && (
            <Box mt={4} textAlign="center">
              <Button
                isLoading={reviews.isFetching || reviews.isLoading}
                onClick={() => reviews.fetchNextPage()}
              >
                더보기
              </Button>
            </Box>
          )}
        </Box>
      ))}

      <Box>
        {reviews.isFetching && !reviews.isFetchingNextPage ? (
          <Center>
            <Spinner />
          </Center>
        ) : null}
      </Box>
    </Box>
  );
}

export default ReviewList;

export interface ReviewDetailProps {
  /** 리뷰 정보 */
  review: GoodsReviewItem;
  /** 리뷰 내용이 기본적으로 접혀있도록 구성할 지 여부 */
  defaultFolded?: boolean;
  /** 수정 버튼을 보여줄 지 여부 (true여도 실제 수정 가능한 유저에게만 보입니다: 관리자, 소비자본인작성후기) */
  editable?: boolean;
  /** 삭제 버튼을 보여줄 지 여부 (true여도 실제 삭제 가능한 유저에게만 보입니다: 관리자, 소비자본인작성후기) */
  removable?: boolean;
  /** 상품 정보 포함할 지 여부 */
  includeGoodsInfo?: boolean;
  /** 해당 후기에 판매자가 댓글을 하나라도 남겼는 지 여부에 따른 Badge를 표시할 지 여부 */
  includeCommentStatus?: boolean;
}
export function ReviewDetail({
  review,
  defaultFolded = false,
  editable = false,
  removable = false,
  includeGoodsInfo = false,
  includeCommentStatus = false,
}: ReviewDetailProps): JSX.Element {
  const displayName = useMemo(() => {
    if (!review.writer.nickname) return asteriskify(review.writer.name);
    return review.writer.nickname;
  }, [review.writer.name, review.writer.nickname]);

  // 이미지 선택
  const dialog = useDisclosure();
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const handleImageClick = (idx: number): void => {
    setSelectedImageIdx(idx);
    dialog.onOpen();
  };
  const handleNextImage = (): void => {
    if (selectedImageIdx === null) setSelectedImageIdx(1);
    else if (selectedImageIdx === review.images.length - 1)
      setSelectedImageIdx(review.images.length - 1);
    else setSelectedImageIdx(selectedImageIdx + 1);
  };
  const handlePrevImage = (): void => {
    if (selectedImageIdx === null) setSelectedImageIdx(0);
    else if (selectedImageIdx === 0) setSelectedImageIdx(0);
    else setSelectedImageIdx(selectedImageIdx - 1);
  };
  // 후기 댓글
  const comments = useGoodsReviewComments(review.id);

  // 접기 기능
  const [folded, setFolded] = useState(defaultFolded);
  const handleUnfold = (): void => {
    setFolded(false);
  };

  const { data: profile } = useProfile(); // 자기 후기인지 확인
  const goods = useGoodsById(review.goodsId); // 후기 상품 정보

  // ********************
  // 후기 수정/삭제 핸들러
  const [selectedComment, setSelectedComment] = useState<null | GoodsReviewCommentItem>(
    null,
  );
  // 후기 댓글 수정 다이얼로그
  const updateCommentDialog = useDisclosure();
  const onCommentUpdate = (_comment: GoodsReviewCommentItem): void => {
    setSelectedComment(_comment);
    updateCommentDialog.onOpen();
  };
  // 후기 댓글 삭제 다이얼로그
  const deleteCommentDialog = useDisclosure();
  const onCommentDelete = (_comment: GoodsReviewCommentItem): void => {
    setSelectedComment(_comment);
    deleteCommentDialog.onOpen();
  };

  return (
    <>
      <Box my={4}>
        {includeCommentStatus && (
          <Box>
            {profile &&
              comments.data &&
              comments.data.some(
                (x) => profile.type === 'seller' && profile.id === x.sellerId,
              ) && (
                <Badge variant="solid" colorScheme="green">
                  (판매자)댓글 작성 완료
                </Badge>
              )}
          </Box>
        )}

        <ReviewDetailButtonSet
          editable={editable}
          removable={removable}
          review={review}
        />

        {includeGoodsInfo && goods.data && (
          <Box my={2}>
            <GoodsDisplay2
              size="xs"
              goods={{
                id: goods.data.id,
                imageSrc: goods.data.image[0]?.image,
                name: goods.data.goods_name,
                seller: goods.data.seller,
              }}
              disableLink
            />
          </Box>
        )}

        <Box my={1}>
          <StarRating rating={review.rating} color="orange.300" />
        </Box>

        <Text color="GrayText">
          {displayName} | {dayjs(review.createDate).format('YYYY-MM-DD')}
        </Text>

        <Flex gap={1} my={2} flexWrap="wrap">
          {review.images.slice(0, 5).map((i, idx) => (
            <ReviewImageListItem
              key={i.id}
              handleImageClick={() => handleImageClick(idx)}
              imageUrl={i.imageUrl}
            />
          ))}
        </Flex>
        <Box>
          <Text
            fontSize="sm"
            whiteSpace="break-spaces"
            noOfLines={folded ? 4 : undefined}
          >
            {review.content}
          </Text>
          {folded && review.content.split('\n').length > 4 && (
            <Button
              my={2}
              variant="outline"
              colorScheme="blue"
              maxW={300}
              w="100%"
              onClick={handleUnfold}
            >
              모두 보기
            </Button>
          )}
        </Box>
        <Box mt={2}>
          <CommentList
            comments={comments.data || []}
            isButtonSetVisible={(comment) => {
              const _comment = comment as GoodsReviewCommentItem;
              return !!(
                profile &&
                (profile.type === 'admin' || // 관리자거나
                  (profile.type === 'customer' && // 로그인 유저가 소비자면서 댓글이 해당 소비자가 작성한 것인 경우
                    profile.id === _comment.customerId) ||
                  (profile.type === 'seller' && // 로그인 유저가 판매자면서 댓글이 해당 판매자가 작성한 것인 경우
                    profile.id === _comment.sellerId))
              );
            }}
            onCommentDelete={(comment) =>
              onCommentDelete(comment as GoodsReviewCommentItem)
            }
            onCommentUpdate={(comment) =>
              onCommentUpdate(comment as GoodsReviewCommentItem)
            }
          />
          {/* 리뷰 수정 다이얼로그 */}
          <ReviewCommentUpdateDialog
            isOpen={updateCommentDialog.isOpen}
            onClose={updateCommentDialog.onClose}
            comment={selectedComment}
          />
          {/* 리뷰 삭제 다이얼로그 */}
          <ReviewCommentDeleteDialog
            isOpen={deleteCommentDialog.isOpen}
            onClose={deleteCommentDialog.onClose}
            review={review}
            comment={selectedComment}
          />
        </Box>
      </Box>
      <Divider />

      {/* 리뷰 이미지 자세히보기 모달 */}
      <Modal
        isOpen={dialog.isOpen && selectedImageIdx !== null}
        onClose={dialog.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0} w="100%">
            {selectedImageIdx !== null && (
              <Box pos="relative">
                <AspectRatio maxH={600} maxW={600} textAlign="center">
                  <ChakraNextImage
                    layout="fill"
                    width="100%"
                    src={review.images[selectedImageIdx].imageUrl}
                    objectFit="cover"
                  />
                </AspectRatio>

                <Flex justify="space-between" px={4} py={{ base: 1, md: 0 }}>
                  <Button
                    pos={{ base: 'static', md: 'absolute' }}
                    left={-16}
                    bottom="calc(50% - 30px)"
                    rounded={{ base: 'md', md: 'full' }}
                    variant="solid"
                    size="md"
                    isDisabled={selectedImageIdx === 0}
                    onClick={handlePrevImage}
                  >
                    <ChevronLeftIcon />
                  </Button>

                  <Button
                    pos={{ base: 'static', md: 'absolute' }}
                    right={-16}
                    bottom="calc(50% - 30px)"
                    rounded={{ base: 'md', md: 'full' }}
                    variant="solid"
                    size="md"
                    isDisabled={selectedImageIdx === review.images.length - 1}
                    onClick={handleNextImage}
                  >
                    <ChevronRightIcon />
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
          <ModalCloseButton
            color="white"
            bgColor="gray.800"
            _focus={{ bgColor: 'gray.700' }}
            _hover={{ bgColor: 'gray.700' }}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

interface ReviewImageListItemProps {
  imageUrl: string;
  handleImageClick: () => void;
}
function ReviewImageListItem({
  imageUrl,
  handleImageClick,
}: ReviewImageListItemProps): JSX.Element | null {
  const resizedImageProps = useResizedImage(imageUrl);
  if (!resizedImageProps.src) return null;
  return (
    <button onClick={handleImageClick} type="button">
      <ChakraNextImage
        rounded="md"
        height="90px"
        width="90px"
        objectFit="cover"
        src={resizedImageProps.src || ''}
        onError={resizedImageProps.onError}
        draggable={false}
        cursor="pointer"
      />
    </button>
  );
}

type ReviewDetailButtonSetProps = Pick<
  ReviewDetailProps,
  'review' | 'editable' | 'removable'
>;
function ReviewDetailButtonSet({
  review,
  editable,
  removable,
}: ReviewDetailButtonSetProps): JSX.Element {
  const { data: profile } = useProfile(); // 로그인 유저 확인을 위해
  const goods = useGoodsById(review.goodsId); // 후기 상품 정보
  // 후기 수정 다이얼로그
  const updateDialog = useDisclosure();
  // 후기 삭제 다이얼로그
  const deleteDialog = useDisclosure();
  // 후기 댓글 작성 다이얼로그
  const createCommentDialog = useDisclosure();

  return (
    <>
      {/* 수정/삭제 */}
      {(profile?.type === 'admin' || // 관리자이거나
        // 소비자 본인이 작성한 후기의 경우
        (profile?.type === 'customer' && profile?.id === review.writerId)) && (
        <Flex gap={2} my={1}>
          {editable && (
            <>
              <Button leftIcon={<EditIcon />} size="xs" onClick={updateDialog.onOpen}>
                수정
              </Button>
              {/* 리뷰 수정 다이얼로그 */}
              <ReviewUpdateDialog
                reviewId={review.id}
                review={review}
                isOpen={updateDialog.isOpen}
                onClose={updateDialog.onClose}
              />
            </>
          )}
          {removable && (
            <>
              <Button leftIcon={<DeleteIcon />} size="xs" onClick={deleteDialog.onOpen}>
                삭제
              </Button>
              {/* 리뷰 삭제 다이얼로그 */}
              <ReviewDeleteDialog
                reviewId={review.id}
                isOpen={deleteDialog.isOpen}
                onClose={deleteDialog.onClose}
              />
            </>
          )}
        </Flex>
      )}

      {/* 댓글 작성 */}
      {((profile && // 해당 상품 판매자인 경우
        profile.type === 'seller' &&
        profile.id === goods.data?.sellerId) ||
        (profile && // 또는 해당 리뷰를 작성한 소비자의 경우
          profile.type === 'customer' &&
          profile.id === review.writerId)) && (
        <>
          <Button
            leftIcon={<AddIcon />}
            size="xs"
            colorScheme="blue"
            variant="outline"
            onClick={createCommentDialog.onOpen}
          >
            댓글 작성
          </Button>
          <ReviewCommentCreateDialog
            goodsReview={review}
            isOpen={createCommentDialog.isOpen}
            onClose={createCommentDialog.onClose}
          />
        </>
      )}
    </>
  );
}
