import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminAllConfirmedLcGoodsList,
  useAdminProductPromotion,
  useAdminProductPromotionCreateMutation,
  useAdminProductPromotionDeleteMutation,
  useAdminProductPromotionUpdateMutation,
} from '@project-lc/hooks';
import {
  CreateProductPromotionDto,
  ProductPromotionListItemData,
  UpdateProductPromotionDto,
} from '@project-lc/shared-types';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface AdminBroadcasterProductPromotionSectionProps {
  promotionPageId: number;
  broadcasterId: number;
}
export function AdminBroadcasterProductPromotionSection({
  promotionPageId,
  broadcasterId,
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
          broadcasterId={broadcasterId}
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

const commissionRateMinMax = {
  max: { value: 100, message: '최대값은 100입니다' },
  min: { value: 0, message: '최소값은 0입니다' },
};

type ProductPromotionCreateFormData = {
  promotionPageId: number;
  goodsId: number | null;
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
                ...commissionRateMinMax,
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
                ...commissionRateMinMax,
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

      <Button type="submit">생성</Button>
    </Stack>
  );
}

/** 상품홍보 아이템 생성 모달 */
export function AdminProductPromotionCreateModal({
  isOpen,
  onClose,
  promotionPageId,
  broadcasterId,
}: {
  isOpen: boolean;
  onClose: () => void;
  promotionPageId: number;
  broadcasterId: number;
}): JSX.Element {
  const toast = useToast();

  const createProductPromotion = useAdminProductPromotionCreateMutation();
  const onSubmit: SubmitHandler<ProductPromotionCreateFormData> = async (data) => {
    const { goodsId, promotionPageId: broadcasterPromotionPageId, ...rest } = data;
    if (!goodsId) return;

    const createDto: CreateProductPromotionDto = {
      broadcasterPromotionPageId,
      goodsId,
      broadcasterId,
      ...rest,
    };
    createProductPromotion
      .mutateAsync(createDto)
      .then(() => {
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
  const updateDialog = useDisclosure();
  const deleteRequest = useAdminProductPromotionDeleteMutation();
  const onDeleteDialogConfirm = useCallback(async () => {
    deleteRequest
      .mutateAsync({
        promotionId: item.id,
        broadcasterPromotionPageId: item.broadcasterPromotionPageId,
      })
      .then(() => {
        deleteDialog.onClose();
        toast({ title: '해당 상품 홍보를 삭제하였습니다', status: 'success' });
      });
  }, [deleteDialog, deleteRequest, item, toast]);
  return (
    <Stack key={item.id} {...boxStyle} w="300px">
      <Stack position="relative" pr={5}>
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
              <AlertTitle mr={2}>
                해당 홍보 상품을 상품 홍보 페이지에서 삭제하시겠습니까?
              </AlertTitle>
            </Stack>
          </Alert>
        </ConfirmDialog>
        <Link href={`/goods/${item.goodsId}`}>
          상품명 :
          <Text as="span" color="blue.500">
            {item.goods.goods_name}
          </Text>
        </Link>
        <Text>판매자 : {item.goods.seller.name}</Text>
        <Text>상점명 : {item.goods.seller?.sellerShop?.shopName}</Text>
      </Stack>
      <Divider />

      <Stack position="relative">
        <Button
          size="xs"
          position="absolute"
          right="0"
          top="0"
          onClick={updateDialog.onOpen}
        >
          수정
        </Button>
        <AdminProductPromotionUpdateModal
          isOpen={updateDialog.isOpen}
          onClose={updateDialog.onClose}
          item={item}
        />

        <Text>와일트루 수수료 : {item.whiletrueCommissionRate} %</Text>
        <Text>방송인 수수료 : {item.broadcasterCommissionRate} %</Text>
      </Stack>
    </Stack>
  );
}

/** 상품홍보 수정 모달 */
export function AdminProductPromotionUpdateModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: ProductPromotionListItemData;
}): JSX.Element {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProductPromotionDto>({
    defaultValues: {
      id: item.id,
      broadcasterPromotionPageId: item.broadcasterPromotionPageId,
      goodsId: item.goodsId || undefined,
      broadcasterCommissionRate: Number(item.broadcasterCommissionRate),
      whiletrueCommissionRate: Number(item.whiletrueCommissionRate),
    },
  });

  const updateRequest = useAdminProductPromotionUpdateMutation();
  const onSubmit: SubmitHandler<UpdateProductPromotionDto> = (data) => {
    if (!data.id || !data.broadcasterPromotionPageId) return;
    const dto: UpdateProductPromotionDto = data;
    updateRequest
      .mutateAsync(dto)
      .then(() => {
        toast({ title: '홍보 상품 정보를 수정하였습니다', status: 'success' });
        onClose();
      })
      .catch((error) => {
        toast({ title: `에러가 발생했습니다 ${error}`, status: 'error' });
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>홍보 상품 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
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
                      ...commissionRateMinMax,
                      required: '방송인 수수료를 작성해주세요.',
                    })}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
              </Stack>
              <FormErrorMessage>
                {errors.broadcasterCommissionRate &&
                  errors.broadcasterCommissionRate.message}
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
                      ...commissionRateMinMax,
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

            <Stack direction="row">
              <Button type="submit" colorScheme="blue">
                수정
              </Button>
              <Button onClick={onClose}>닫기</Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AdminBroadcasterProductPromotionSection;
