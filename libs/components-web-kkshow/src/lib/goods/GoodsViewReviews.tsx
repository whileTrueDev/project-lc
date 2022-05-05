/* eslint-disable react/no-array-index-key */
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
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
import StarRating from '@project-lc/components-core/StarRating';
import {
  useGoodsById,
  useGoodsReviewComments,
  useInfiniteReviews,
} from '@project-lc/hooks';
import { GoodsReviewItem } from '@project-lc/shared-types';
import { asteriskify } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import { CommentList } from '../CommentList';

export function GoodsViewReviews(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  const reviews = useInfiniteReviews({ skip: 0, take: 5, goodsId: goods.data?.id });

  if (!reviews.data) return null;
  if (reviews.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <Box maxW="5xl" m="auto" id="goods-reviews" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">상품 후기</Text>
      <Box>
        {reviews.data.pages.map((page, idx) => (
          <Box key={idx}>
            {page.reviews.length === 0 && (
              <Box my={10}>
                <Text>아직 이 상품에 대한 후기가 없습니다.</Text>
              </Box>
            )}

            {page.reviews.map((review) => (
              <ReviewDetail key={review.id} review={review} />
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
    </Box>
  );
}

interface ReviewDetailProps {
  review: GoodsReviewItem;
}
function ReviewDetail({ review }: ReviewDetailProps): JSX.Element {
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
  const comments = useGoodsReviewComments(review.id);
  return (
    <>
      <Box my={4}>
        <StarRating rating={review.rating} color="orange.300" />
        <Text color="GrayText">
          {displayName} | {dayjs(review.createDate).format('YYYY-MM-DD')}
        </Text>

        <Flex gap={1} my={2}>
          {review.images.slice(0, 5).map((i, idx) => (
            <Image
              key={i.id}
              h="100px"
              w="100px"
              objectFit="cover"
              src={i.imageUrl}
              draggable={false}
              cursor="pointer"
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </Flex>
        <Flex>
          <Text fontSize="sm" whiteSpace="break-spaces">
            {review.content}
          </Text>
        </Flex>
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
          <ModalBody p={0}>
            {selectedImageIdx !== null && (
              <Box pos="relative">
                <AspectRatio maxH={600} maxW={600} textAlign="center">
                  <Image
                    w="100%"
                    src={review.images[selectedImageIdx].imageUrl}
                    objectFit="cover"
                  />
                </AspectRatio>

                <Button
                  pos="absolute"
                  left={-16}
                  bottom="calc(50% - 30px)"
                  rounded="full"
                  variant="solid"
                  size="md"
                  isDisabled={selectedImageIdx === 0}
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon />
                </Button>

                <Button
                  pos="absolute"
                  right={-16}
                  bottom="calc(50% - 30px)"
                  rounded="full"
                  variant="solid"
                  size="md"
                  isDisabled={selectedImageIdx === review.images.length - 1}
                  onClick={handleNextImage}
                >
                  <ChevronRightIcon />
                </Button>
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
