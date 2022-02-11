import {
  Stack,
  Button,
  Box,
  Link,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  FormHelperText,
  Divider,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  getAdminDuplicateFmGoodsSeqFlagForProductPromotion,
  useAdminAllConfirmedLcGoodsList,
  useAdminProductPromotion,
  useAdminProductPromotionCreateMutation,
  useAdminProductPromotionDeleteMutation,
} from '@project-lc/hooks';
import {
  CreateProductPromotionDto,
  ProductPromotionListItemData,
} from '@project-lc/shared-types';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface AdminBroadcasterProductPromotionSectionProps {
  promotionPageId: number;
}
export function AdminBroadcasterProductPromotionSection({
  promotionPageId,
}: AdminBroadcasterProductPromotionSectionProps): JSX.Element {
  const { data: productPromotionList } = useAdminProductPromotion(promotionPageId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text>홍보중인 상품 </Text>
        <Button onClick={onOpen}>상품 추가하기</Button>
        <AdminProductPromotionCreateModal
          isOpen={isOpen}
          onClose={onClose}
          promotionPageId={promotionPageId}
        />
      </Stack>

      {productPromotionList && productPromotionList.length > 0 ? (
        <Stack direction="row">
          {productPromotionList.map((item) => (
            <ProductPromotionItemBox item={item} key={item.id} />
          ))}
        </Stack>
      ) : (
        <Text>홍보중인 상품이 없습니다 </Text>
      )}
    </Stack>
  );
}

type ProductPromotionCreateFormData = {
  promotionPageId: number;
  goodsId: number | null;
  fmGoodsSeq: number | null;
  broadcasterCommissionRate?: number;
  whiletrueCommissionRate?: number;
};

/** 상품홍보생성 폼 */
export function AdminProductPromotionForm({
  onSubmitHandler,
  defaultValues,
}: {
  onSubmitHandler: SubmitHandler<ProductPromotionCreateFormData>;
  defaultValues: ProductPromotionCreateFormData;
}): JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductPromotionCreateFormData>({
    defaultValues,
  });

  const { data: goods } = useAdminAllConfirmedLcGoodsList();
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Stack direction="row">
        <Text>상품</Text>
        <ChakraAutoComplete
          options={goods || []}
          getOptionLabel={(option) => option?.goods_name || ''}
          onChange={(newV) => {
            if (newV) {
              setValue('goodsId', newV.id);
            } else {
              setValue('goodsId', null);
            }
          }}
        />
      </Stack>
      <FormControl isInvalid={!!errors.broadcasterCommissionRate}>
        <Stack direction="row">
          <FormLabel htmlFor="broadcasterCommissionRate" width="50%">
            방송인 수수료
          </FormLabel>
          <InputGroup>
            <Input
              id="broadcasterCommissionRate"
              defaultValue={5}
              autoComplete="off"
              {...register('broadcasterCommissionRate', {
                valueAsNumber: true,
                validate: {
                  min: (v) => (v && v >= 0) || '최소값은 0입니다',
                  max: (v) => (v && v <= 100) || '최대값은 100입니다',
                },
                required: '방송인 수수료를 작성해주세요.',
              })}
            />
            <InputRightAddon>%</InputRightAddon>
          </InputGroup>
        </Stack>
        <FormErrorMessage>
          {errors.broadcasterCommissionRate && errors.broadcasterCommissionRate.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.whiletrueCommissionRate}>
        <Stack direction="row">
          <FormLabel htmlFor="whiletrueCommissionRate" width="50%">
            와일트루 수수료
          </FormLabel>
          <InputGroup>
            <Input
              id="whiletrueCommissionRate"
              defaultValue={5}
              autoComplete="off"
              {...register('whiletrueCommissionRate', {
                valueAsNumber: true,
                validate: {
                  min: (v) => (v && v >= 0) || '최소값은 0입니다',
                  max: (v) => (v && v <= 100) || '최대값은 100입니다',
                },
                required: '와일트루 수수료를 작성해주세요.',
              })}
            />
            <InputRightAddon>%</InputRightAddon>
          </InputGroup>
        </Stack>

        <FormErrorMessage>
          {errors.whiletrueCommissionRate && errors.whiletrueCommissionRate.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.fmGoodsSeq}>
        <Stack direction="row">
          <FormLabel htmlFor="fmGoodsSeq" width="70%">
            퍼스트몰 상품 고유번호
          </FormLabel>
          <Input
            id="fmGoodsSeq"
            autoComplete="off"
            type="number"
            {...register('fmGoodsSeq', {
              required: '퍼스트몰 상품 고유번호를 입력해주세요.',
              valueAsNumber: true,
              validate: async (_fmGoodsSeq) => {
                if (!_fmGoodsSeq) return '상품 고유번호는 숫자여야 합니다';
                const isDuplicateFmGoodsSeq =
                  await getAdminDuplicateFmGoodsSeqFlagForProductPromotion(_fmGoodsSeq);
                return (
                  !isDuplicateFmGoodsSeq ||
                  '입력하신 퍼스트몰 고유번호는 다른 상품과 연결되어 있습니다. 상품홍보용 제품의 퍼스트몰 고유 번호는 다른 제품의 고유번호와 중복될 수 없습니다. 고유번호를 다시 확인해주세요.'
                );
              },
            })}
          />
        </Stack>
        <FormErrorMessage>
          {errors.fmGoodsSeq && errors.fmGoodsSeq.message}
        </FormErrorMessage>
        <FormHelperText>
          퍼스트몰에 등록한 상품의 고유번호를
          입력하세요.(http://whiletrue.firstmall.kr/goods/view?no=
          <Text as="span" color="red">
            41
          </Text>
          의&nbsp;
          <Text as="span" color="red">
            41
          </Text>
          을 입력)
        </FormHelperText>
      </FormControl>
      <Button type="submit">생성</Button>
    </Stack>
  );
}

/** 상품홍보 아이템 생성 모달 */
export function AdminProductPromotionCreateModal({
  isOpen,
  onClose,
  promotionPageId,
}: {
  isOpen: boolean;
  onClose: () => void;
  promotionPageId: number;
}): JSX.Element {
  const toast = useToast();

  const createProductPromotion = useAdminProductPromotionCreateMutation();
  const onSubmit: SubmitHandler<ProductPromotionCreateFormData> = async (data) => {
    const {
      goodsId,
      fmGoodsSeq,
      promotionPageId: broadcasterPromotionPageId,
      ...rest
    } = data;
    if (!goodsId || !fmGoodsSeq) return;

    const createDto: CreateProductPromotionDto = {
      broadcasterPromotionPageId,
      goodsId,
      fmGoodsSeq,
      ...rest,
    };
    createProductPromotion
      .mutateAsync(createDto)
      .then((res) => {
        toast({ title: '생성 성공', status: 'success' });
        onClose();
      })
      .catch((error) => {
        toast({ title: `생성 실패 error - ${error}`, status: 'error' });
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상품 홍보 아이템 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AdminProductPromotionForm
            onSubmitHandler={onSubmit}
            defaultValues={{
              promotionPageId,
              goodsId: null,
              fmGoodsSeq: null,
              broadcasterCommissionRate: 5,
              whiletrueCommissionRate: 5,
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/** 상품홍보 아이템 표시 박스 */
export function ProductPromotionItemBox({
  item,
}: {
  item: ProductPromotionListItemData;
}): JSX.Element {
  const toast = useToast();
  const deleteDialog = useDisclosure();
  const deleteRequest = useAdminProductPromotionDeleteMutation();
  const onDeleteDialogConfirm = useCallback(async () => {
    deleteRequest
      .mutateAsync({
        promotionId: item.id,
        broadcasterPromotionPageId: item.broadcasterPromotionPageId,
      })
      .then((res) => {
        deleteDialog.onClose();
        toast({
          title: '해당 상품 홍보를 삭제하였습니다',
          status: 'success',
        });
      });
  }, [deleteDialog, deleteRequest, item, toast]);
  return (
    <Stack key={item.id} {...boxStyle} minW="240px">
      <Stack position="relative">
        <CloseButton
          size="sm"
          position="absolute"
          right="0"
          top="0"
          onClick={deleteDialog.onOpen}
        />
        {/* 상품홍보 삭제 모달창 */}
        <ConfirmDialog
          title="홍보 상품 삭제"
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onConfirm={onDeleteDialogConfirm}
        >
          <Alert status="error">
            <AlertIcon />
            <Stack>
              <AlertTitle mr={2}>해당 홍보 상품을 삭제하시겠습니까?</AlertTitle>
            </Stack>
          </Alert>
        </ConfirmDialog>
        <Link href={`/goods/${item.goodsId}`} color="blue.500">
          상품명 : {item.goods.goods_name}
        </Link>
        <Text>판매자 : {item.goods.seller.name}</Text>
        <Text>상점명 : {item.goods.seller?.sellerShop?.shopName}</Text>
      </Stack>
      <Divider />

      <Stack position="relative">
        <Button size="xs" position="absolute" right="0" top="0">
          수정
        </Button>
        <Text>와일트루 수수료 : {item.whiletrueCommissionRate} %</Text>
        <Text>방송인 수수료 : {item.broadcasterCommissionRate} %</Text>
      </Stack>
    </Stack>
  );
}

export default AdminBroadcasterProductPromotionSection;
