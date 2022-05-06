/* eslint-disable react/no-array-index-key */
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Goods } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useGoodsById,
  useGoodsInquiryComments,
  useGoodsInquiryDeleteMutation,
  useGoodsInquiryMutation,
  useInfiniteGoodsInquiries,
  useProfile,
} from '@project-lc/hooks';
import { FindGoodsInquiryItem, GoodsInquiryCreateDto } from '@project-lc/shared-types';
import { asteriskify } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { CommentList } from '../CommentList';

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

      <GoodsInquiryFormDialog isOpen={formDialog.isOpen} onClose={formDialog.onClose} />
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

      <ConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        onClose={deleteConfirmDialog.onClose}
        title="상품 문의 삭제"
        onConfirm={async () => deleteMutation.mutateAsync(inquiry.id)}
      >
        상품문의를 삭제하시겠습니까?
      </ConfirmDialog>

      <Divider />
    </>
  );
}

interface GoodsInquiryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
function GoodsInquiryFormDialog({
  isOpen,
  onClose,
}: GoodsInquiryFormDialogProps): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const formMethods = useForm<GoodsInquiryCreateDto>();
  return (
    <FormProvider {...formMethods}>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>상품 문의하기</ModalHeader>
          <ModalBody>
            <GoodsInquiryForm
              goodsId={goodsId}
              onCancel={onClose}
              onSubmitSuccess={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}

interface GoodsInquiryFormProps {
  goodsId: Goods['id'] | string;
  onCancel: () => void;
  onSubmitSuccess: () => void;
}
function GoodsInquiryForm({
  goodsId,
  onCancel,
  onSubmitSuccess,
}: GoodsInquiryFormProps): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const profile = useProfile();
  const goods = useGoodsById(goodsId);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext<GoodsInquiryCreateDto>();

  const onSuccess = (): void => {
    toast({ status: 'success', title: '상품 문의가 작성되었습니다.' });
    onSubmitSuccess();
  };
  const onFail = (err: any): void => {
    console.log(err);
    toast({
      status: 'error',
      title: '상품 문의를 작성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  };

  const mutation = useGoodsInquiryMutation();
  const onSubmit = (data: GoodsInquiryCreateDto): void => {
    if (profile.data?.id) {
      mutation
        .mutateAsync({
          content: data.content,
          goodsId: Number(goodsId),
          writerId: profile.data.id,
        })
        .then(onSuccess)
        .catch(onFail);
    }
  };

  const onLoginClick = (): void => {
    router.push('/login', { query: { nextpage: `/goods/${goodsId}` } });
  };

  if (!profile.data?.id) {
    return (
      <Box textAlign="center" my={4}>
        <Text>문의를 남기기 위해 로그인이 필요합니다.</Text>
        <Button onClick={onLoginClick}>로그인</Button>
      </Box>
    );
  }

  return (
    <Box id="goods-inquiry-form" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Box mb={2}>
        <GoodsInquiryPolicy />
      </Box>
      <Box my={2}>
        {goods.data && <Text>문의하는 상품: {goods.data.goods_name}</Text>}
      </Box>

      <FormControl isInvalid={!!errors.content}>
        <Textarea
          maxH={350}
          placeholder="문의 내용은 최대 300자까지 작성 가능합니다."
          {...register('content', {
            required: '문의 내용을 작성해주세요.',
            maxLength: {
              value: 300,
              message: '문의 내용은 300자를 초과할 수 없습니다.',
            },
          })}
        />
        {errors.content?.message && (
          <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
        )}
      </FormControl>

      <Box textAlign="right">
        <ButtonGroup mt={4}>
          <Button onClick={onCancel}>취소</Button>
          <Button
            isDisabled={!profile.data?.id}
            id="goods-inquiry-form"
            type="submit"
            colorScheme="blue"
          >
            등록
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

export function GoodsInquiryPolicy(): JSX.Element {
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
        상품 문의 원칙 {policyList.isOpen ? '숨기기' : '보기'}
      </Text>

      <Collapse in={policyList.isOpen}>
        <UnorderedList fontSize="xs" my={2}>
          {/* // TODO: 기획자에게 전달받아 수정 필요 현재 내용은 ㅁㅋㅋㄹ 문의 운영원칙임 */}
          <ListItem>
            구매한 상품의 취소/반품은 마이쿠팡 구매내역에서 신청 가능합니다.
          </ListItem>
          <ListItem>
            상품문의 및 후기게시판을 통해 취소나 환불, 반품 등은 처리되지 않습니다.
          </ListItem>
          <ListItem>
            가격, 판매자, 교환/환불 및 배송 등 해당 상품 자체와 관련 없는 문의는 고객센터
            내 1:1문의하기를 이용해주세요.
          </ListItem>
          <ListItem>
            해당 상품 자체와 관계없는 글, 양도, 광고성, 욕설, 비방, 도배 등의 글은 예고
            없이 이동, 노출제한, 삭제 등의 조치가 취해질 수 있습니다.
          </ListItem>
          <ListItem>
            공개 게시판이므로 전화번호, 메일 주소 등 고객님의 소중한 개인정보는절대 남기지
            말아주세요.
          </ListItem>
        </UnorderedList>
      </Collapse>
    </Box>
  );
}
