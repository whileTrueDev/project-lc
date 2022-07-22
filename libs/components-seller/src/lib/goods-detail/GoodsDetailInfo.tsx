import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GOODS_CANCEL_TYPE } from '@project-lc/components-constants/goodsRegistTypes';
import { GoodsConfirmStatusBadge } from '@project-lc/components-shared/GoodsConfirmStatusBadge';
import GoodsStatusBadge from '@project-lc/components-shared/GoodsStatusBadge';
import {
  useConnectCategoryOnGoodsMutation,
  useDisconnectCategoryOnGoodsMutation,
  useGoodsCategory,
} from '@project-lc/hooks';
import { GoodsByIdRes, GoodsCategoryItem } from '@project-lc/shared-types';
import { useState } from 'react';
import { Category } from '../goods-regist/GoodsRegistCategory';

export interface GoodsDetailInfoProps {
  goods: GoodsByIdRes;
  /** 상품에 연결된 카테고리 관리 다이얼로그 사용가능 여부, default : false
   * 관리자페이지에서 true로 사용
   */
  enableCategoryOnGoodsManagement?: boolean;
}
export function GoodsDetailInfo({
  goods,
  enableCategoryOnGoodsManagement = false,
}: GoodsDetailInfoProps): JSX.Element {
  const categoryDialog = useDisclosure();
  return (
    <Stack>
      <Box>
        <Text fontWeight="bold">상품명</Text>
        <Text>{goods.goods_name}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">간략설명</Text>
        <Text>{goods.summary}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">판매상태</Text>
        <GoodsStatusBadge goodsStatus={goods.goods_status} />
      </Box>

      <Box>
        <Text fontWeight="bold">검수 여부</Text>
        <GoodsConfirmStatusBadge confirmStatus={goods.confirmation?.status} />
      </Box>

      <Box>
        <Text fontWeight="bold">청약철회(취소,환불,교환) 가능여부</Text>
        <Text>
          {GOODS_CANCEL_TYPE.find((type) => type.value === goods.cancel_type)?.label}
        </Text>
      </Box>

      <Box>
        <Stack direction="row">
          <Text fontWeight="bold">카테고리</Text>
          {enableCategoryOnGoodsManagement && (
            <>
              <Button size="xs" onClick={categoryDialog.onOpen}>
                카테고리 관리
              </Button>
              <CategoryOnGoodsDialog
                goodsId={goods.id}
                currentCategories={goods.categories}
                onClose={categoryDialog.onClose}
                isOpen={categoryDialog.isOpen}
              />
            </>
          )}
        </Stack>

        <Box>
          {goods.categories.map((category) => (
            <Text key={category.id}>{category.name}</Text>
          ))}
        </Box>
      </Box>

      {goods.informationNotice && goods.informationNotice.contents && (
        <Box>
          <Text fontWeight="bold">상품 필수 정보</Text>
          <Box fontSize="sm">
            {Object.keys(goods.informationNotice.contents).map((key) => (
              <Grid key={key} templateColumns="repeat(4, 1fr)" py={1} gap={2}>
                <GridItem colSpan={[4, 4, 1]}>{key}</GridItem>
                <GridItem colSpan={[4, 4, 3]} alignItems="center" display="flex">
                  {goods.informationNotice.contents[key]}
                </GridItem>
              </Grid>
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
}
export interface CategoryOnGoodsManagementProps {
  /** 카테고리 연결 혹은 해제할 상품 고유번호 */
  goodsId: number;
  /** 상품에 연결되어있는 카테고리 목록 */
  currentCategories: GoodsByIdRes['categories'];
}
export interface CategoryOnGoodsDialogProps
  extends Pick<ModalProps, 'isOpen' | 'onClose'>,
    CategoryOnGoodsManagementProps {}
/** 상품에 연결된 카테고리 해제, 추가 관리 다이얼로그 */
export function CategoryOnGoodsDialog({
  isOpen,
  onClose,
  goodsId,
  currentCategories,
}: CategoryOnGoodsDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>카테고리 연결 및 해제</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={8}>
            <ConnectCategoryOnGoodsSection
              goodsId={goodsId}
              currentCategories={currentCategories}
            />
            <DisconnectCategoryOnGoodsSection
              goodsId={goodsId}
              currentCategories={currentCategories}
            />
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function ConnectCategoryOnGoodsSection({
  goodsId,
  currentCategories,
}: CategoryOnGoodsManagementProps): JSX.Element {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<null | GoodsCategoryItem>(
    null,
  );

  const onCategoryClick = (category: GoodsCategoryItem): void => {
    setSelectedCategory(category);
  };

  const successHandler = (): void => {
    toast({ status: 'success', title: '선택된 카테고리를 상품에 연결하였습니다' });
  };
  const errorHandler = (e: any): void => {
    toast({
      status: 'error',
      title: '선택된 카테고리를 상품에 연결하지 못했습니다',
      description: e?.response?.data?.message || e?.message,
    });
    console.error(e);
  };
  const connectMutation = useConnectCategoryOnGoodsMutation();
  const connectHandler = (): void => {
    if (!selectedCategory) return;
    if (currentCategories.map((c) => c.id).includes(selectedCategory.id)) {
      toast({ status: 'error', title: '이미 상품에 연결된 카테고리입니다' });
      return;
    }
    connectMutation
      .mutateAsync({ goodsId, categoryId: selectedCategory.id })
      .then(successHandler)
      .catch(errorHandler);
  };

  const { data, isLoading } = useGoodsCategory({ mainCategoryFlag: true });
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!data) return <Text>카테고리가 없습니다</Text>;
  return (
    <Stack spacing={1}>
      <Stack direction="row">
        <Text>선택된 카테고리: {selectedCategory?.name || '없음'}</Text>

        <Button
          size="xs"
          onClick={connectHandler}
          disabled={!selectedCategory}
          isLoading={connectMutation.isLoading}
        >
          카테고리 추가하기
        </Button>
      </Stack>
      <Divider />
      {data.map((mainCategory) => (
        <Category
          key={mainCategory.id}
          category={mainCategory}
          onClick={onCategoryClick}
        />
      ))}
    </Stack>
  );
}

export function DisconnectCategoryOnGoodsSection({
  goodsId,
  currentCategories,
}: CategoryOnGoodsManagementProps): JSX.Element {
  const toast = useToast();

  const successHandler = (): void => {
    toast({ status: 'success', title: '선택된 카테고리 연결을 해제하였습니다' });
  };
  const errorHandler = (e: any): void => {
    toast({
      status: 'error',
      title: '선택된 카테고리 연결을 해제하지 못했습니다',
      description: e?.response?.data?.message || e?.message,
    });
    console.error(e);
  };
  const disconnectMutation = useDisconnectCategoryOnGoodsMutation();
  const disconnectCategory = (categoryId: number): void => {
    disconnectMutation
      .mutateAsync({ categoryId, goodsId })
      .then(successHandler)
      .catch(errorHandler);
  };
  return (
    <Stack spacing={1}>
      <Text>상품에 연결된 카테고리 목록</Text>
      <Divider />
      <Stack spacing={1}>
        {currentCategories.length === 0 && <Text>없음</Text>}
        {currentCategories.map((c) => (
          <Stack direction="row" key={c.id}>
            <Box>{c.name}</Box>
            <Button
              size="xs"
              onClick={() => disconnectCategory(c.id)}
              isLoading={disconnectMutation.isLoading}
            >
              해제
            </Button>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
