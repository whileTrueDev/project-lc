/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  FormErrorMessage,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Goods } from '@prisma/client';
import { useGoodsById, useGoodsInquiryMutation, useProfile } from '@project-lc/hooks';
import { GoodsInquiryCreateDto } from '@project-lc/shared-types';

import { useRouter } from 'next/router';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

export interface GoodsInquiryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goodsId: Goods['id'] | string;
}
export function GoodsInquiryFormDialog({
  isOpen,
  onClose,
  goodsId,
}: GoodsInquiryFormDialogProps): JSX.Element {
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
export function GoodsInquiryForm({
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
          <ListItem>
            구매한 상품의 취소/반품은 크크쇼 주문/배송내역에서 신청할 수 있습니다.
          </ListItem>
          <ListItem>
            상품문의 및 후기게시판을 통해 취소나 환불, 반품 등은 처리되지 않습니다.
          </ListItem>
          <ListItem>
            가격, 판매자, 교환/환불 및 배송 등 해당 상품 자체와 관련 없는 문의는
            고객센터를 이용해주세요.
          </ListItem>
          <ListItem>
            해당 상품 자체와 관계없는 글, 양도, 광고성, 욕설, 비방, 도배 등의 글은 예고
            없이 이동, 노출 제한, 삭제 등의 조치가 취해질 수 있습니다.
          </ListItem>
          <ListItem>
            공개 게시판이므로 전화번호, 메일 주소 등 고객님의 소중한 개인정보는 절대
            남기지 말아주세요.
          </ListItem>
        </UnorderedList>
      </Collapse>
    </Box>
  );
}
