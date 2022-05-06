/* eslint-disable react/no-array-index-key */
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Image,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  UnorderedList,
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

      <ReviewPolicy />

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
    </>
  );
}

export function ReviewPolicy(): JSX.Element {
  const policyList = useDisclosure();
  return (
    <Box>
      <Text
        as="span"
        textDecor="underline"
        fontSize="sm"
        cursor="pointer"
        role="button"
        onClick={policyList.onToggle}
      >
        상품 후기 원칙 {policyList.isOpen ? '숨기기' : '보기'}
      </Text>
      <Collapse in={policyList.isOpen}>
        <UnorderedList fontSize="xs" my={2}>
          {/* // TODO: 기획자에게 전달받아 수정 필요. 현재 내용은 ㅋㅍ 상품평 운영원칙임 */}
          <ListItem>
            작성된 글과 첨부도니 멀티미디어 파일등으로 이루어진 각 상품후기는 개인의
            의견을 반영하므로 게시된 내용에 대한 모든 책임은 작성자에게 있습니다.
          </ListItem>
          <ListItem>
            상품평은 상품의 사용 관련 후기인 바, 배송 주문취소 재배송 등에 관한 문의사항을
            고객센터로 제기하기 바랍니다.
          </ListItem>
          <ListItem whiteSpace="break-spaces">
            다음과 같은 내용은 상품 후기에 허용되지 않는 부류인 바, 상품평 작성시
            주의하시기바랍니다.
            {`\n- 주관적인 의견으로 인해 상품의 기능 및 효과에 대하여 오해의 소지가 있는 내용\n- 식품/건강식품과 관련하여 질병의 예방 및 치료, 체중감량에 효능/효과가 있다는 내용\n- 비방, 욕설, 도배 등의 게시물 또는 방복되는 동일 단어나 문장\n- 타인 또는 기타 기관이 작성, 공개한 정보를 복사하여 기재한 부분\n- 상업적 목적의 광고성 내용\n- 그 밖에 상품후기 운영원칙에 위배되거나 그러하다고 사료되는 내용`}
          </ListItem>
          <ListItem>
            해당 상품 자체와 관계없는 글, 양도, 광고성, 욕설, 비방, 도배 등의 글은 예고
            없이 이동, 노출제한, 삭제 등의 조치가 취해질 수 있습니다.
          </ListItem>
          <ListItem>
            상품 후기로 인해 다른 회원 또는 제 3자에게 피해가 가해질 경우, 법적인 책임이
            따를 수 있으며, 이에 대한 책임은 상품후기를 게시한 당사자에게 있습니다.
          </ListItem>
          <ListItem>
            개인정보 보호와 관련된 피해를 방지하기 위해 주민번호, 전화번호, 이메일, 연락처
            등의 내용 기입은 삽가주시기바랍니다. 해당 내용이 발견되는 경우, 제 3자 노출을
            방지하기 위해 관리자에 의해 삭제 처리될 수 있습니다.
          </ListItem>
          <ListItem>
            이 외 상품후기의 성격에 맞지 않는 내용은 관리자에 의해 삭제처리될 수 있습니다.
          </ListItem>
        </UnorderedList>
      </Collapse>
    </Box>
  );
}
