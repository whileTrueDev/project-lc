/* eslint-disable react/no-array-index-key */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import StarRating from '@project-lc/components-core/StarRating';
import {
  useGoodsReviewComments,
  useInfiniteReviews,
  useProfile,
} from '@project-lc/hooks';
import { FindManyGoodsReviewDto, GoodsReviewItem } from '@project-lc/shared-types';
import { asteriskify } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { CommentList } from '../CommentList';
import ReviewDeleteDialog from './ReviewDeleteDialog';
import ReviewUpdateDialog from './ReviewUpdateDialog';

export interface ReviewListProps extends Omit<ReviewDetailProps, 'review'> {
  dto: FindManyGoodsReviewDto;
  enabled?: boolean;
}
export function ReviewList({
  dto,
  enabled,
  ...rest
}: ReviewListProps): JSX.Element | null {
  const reviews = useInfiniteReviews(dto, enabled);
  if (!reviews.data) return null;
  if (reviews.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <Box>
      {reviews.data.pages.map((page, idx) => (
        <Box key={idx}>
          {page.reviews.length === 0 && (
            <Box my={10}>
              <Text>아직 후기가 없습니다.</Text>
            </Box>
          )}

          {page.reviews.map((review) => (
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
  review: GoodsReviewItem;
  defaultFolded?: boolean;
  editable?: boolean;
  removable?: boolean;
}
export function ReviewDetail({
  review,
  defaultFolded = false,
  editable,
  removable,
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
  // 리뷰 댓글
  const comments = useGoodsReviewComments(review.id);

  // 접기 기능
  const [folded, setFolded] = useState(defaultFolded);
  const handleUnfold = (): void => {
    setFolded(false);
  };

  // 자기 리뷰인지 확인
  const profile = useProfile();

  // 리뷰 수정 다이얼로그
  const updateDialog = useDisclosure();
  // 리뷰 삭제 다이얼로그
  const deleteDialog = useDisclosure();

  return (
    <>
      <Box my={4}>
        {profile.data?.id === review.writerId && (
          <Flex gap={2} my={1}>
            {editable && (
              <Button leftIcon={<EditIcon />} size="xs" onClick={updateDialog.onOpen}>
                수정
              </Button>
            )}
            {removable && (
              <Button leftIcon={<DeleteIcon />} size="xs" onClick={deleteDialog.onOpen}>
                삭제
              </Button>
            )}
          </Flex>
        )}

        <StarRating rating={review.rating} color="orange.300" />
        <Text color="GrayText">
          {displayName} | {dayjs(review.createDate).format('YYYY-MM-DD')}
        </Text>

        <Flex gap={1} my={2} flexWrap="wrap">
          {review.images.slice(0, 5).map((i, idx) => (
            <Image
              key={i.id}
              h="90px"
              w="90px"
              objectFit="cover"
              src={i.imageUrl}
              draggable={false}
              cursor="pointer"
              onClick={() => handleImageClick(idx)}
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
          {folded && (
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
        <Box mt={2}>{comments.data && <CommentList comments={comments.data} />}</Box>
      </Box>
      <Divider />

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
                  <Image
                    w="100%"
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

      <ReviewUpdateDialog
        reviewId={review.id}
        review={review}
        isOpen={updateDialog.isOpen}
        onClose={updateDialog.onClose}
      />

      <ReviewDeleteDialog
        reviewId={review.id}
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
      />
    </>
  );
}
