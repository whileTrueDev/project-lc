/* eslint-disable react/no-array-index-key */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import MypageLayout from '@project-lc/components-shared/MypageLayout';
import { CommentList } from '@project-lc/components-web-kkshow/CommentList';
import {
  useGoodsInquiryCommentMutation,
  useGoodsInquiryComments,
  useGoodsOutlineById,
  useInfiniteGoodsInquiries,
  useProfile,
} from '@project-lc/hooks';
import { FindGoodsInquiryItem, GoodsInquiryCommentDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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

interface SellerGoodsInquiryListItemProps {
  inquiry: FindGoodsInquiryItem;
}
function SellerGoodsInquiryListItem({
  inquiry,
}: SellerGoodsInquiryListItemProps): JSX.Element {
  const createDialog = useDisclosure();
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

        <Button size="sm" leftIcon={<EditIcon />} onClick={createDialog.onOpen}>
          답변생성
        </Button>
        <SellerGoodsInquiryCommentCreateDialog
          inquiry={inquiry}
          isOpen={createDialog.isOpen}
          onClose={createDialog.onClose}
        />
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

      <CommentList
        commentType="답변"
        comments={comment.data || []}
        buttonSet={({ comment: c }): JSX.Element | null => {
          if (profile?.id && c.sellerId)
            return (
              <ButtonGroup size="xs">
                <Button onClick={() => alert(`수정 ${c.id}`)} leftIcon={<EditIcon />}>
                  수정
                </Button>
                <Button onClick={() => alert(`삭제 ${c.id}`)} leftIcon={<DeleteIcon />}>
                  삭제
                </Button>
              </ButtonGroup>
            );
          return null;
        }}
      />
    </Box>
  );
}
interface SellerGoodsInquiryCommentCreateDialogProps
  extends SellerGoodsInquiryListItemProps {
  isOpen: boolean;
  onClose: () => void;
}
function SellerGoodsInquiryCommentCreateDialog({
  inquiry,
  isOpen,
  onClose,
}: SellerGoodsInquiryCommentCreateDialogProps): JSX.Element {
  const formId = 'goods-inquiry-comment-form';
  const toast = useToast();
  const { data: profile } = useProfile();

  const goodsInquiryCreate = useGoodsInquiryCommentMutation();
  const handleSubmit: SubmitHandler<GoodsInquiryCommentDto> = (formData) => {
    if (profile) {
      goodsInquiryCreate
        .mutateAsync({
          goodsInquiryId: inquiry.id,
          content: formData.content,
          sellerId: profile.id,
        })
        .then(() => {
          toast({ description: '상품 문의 답변을 작성하였습니다.', status: 'success' });
          onClose();
        })
        .catch(() => {
          toast({
            description:
              '상품 문의 답변을 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
            <Button form={formId} type="submit" colorScheme="blue">
              생성
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface GoodsInquiryCommentFormProps {
  formId: string;
  onSubmit: SubmitHandler<GoodsInquiryCommentDto>;
}
function GoodsInquiryCommentForm({
  formId,
  onSubmit,
}: GoodsInquiryCommentFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoodsInquiryCommentDto>();
  return (
    <Box as="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.content}>
        <FormLabel>문의 답변 내용</FormLabel>
        <Textarea
          size="sm"
          {...register('content', {
            required: '문의 답변 내용을 작성해주세요.',
            maxLength: {
              value: 500,
              message: '문의 답변은 최대 500자까지 작성 가능합니다.',
            },
          })}
        />
        <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
