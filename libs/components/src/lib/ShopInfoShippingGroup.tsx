import {
  Button,
  Center,
  CloseButton,
  Grid,
  GridItem,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  ShippingGroupListItemType,
  useDeleteShippingGroup,
  useSellerShippingGroupList,
} from '@project-lc/hooks';
import { ShippingCalculTypeOptions } from '@project-lc/shared-types';
import { useCallback } from 'react';
import {
  ShippingGroupContainerBox,
  ShippingGroupDeleteConfirmDialog,
  ShippingGroupDetailModal,
  ShippingGroupRegistDialog,
  ShippingGroupRelatedItemsDialog,
} from './GoodsRegistShippingPolicy';
import SettingSectionLayout from './SettingSectionLayout';

/** 상점설정에서 사용하는 배송비정책 아이템 - 라디오버튼이 없다 */
export function ShopInfoShippingPolicyItem({
  group,
}: {
  group: ShippingGroupListItemType;
}): JSX.Element {
  const {
    isOpen: confirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();
  const {
    isOpen: infoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure();
  const {
    isOpen: relatedGoodsModalOpen,
    onOpen: onRelatedGoodsModalOpen,
    onClose: onRelatedGoodsModalClose,
  } = useDisclosure();
  const toast = useToast();
  const { mutateAsync } = useDeleteShippingGroup();
  const { id, shipping_group_name, shipping_calcul_type, _count } = group;

  // 배송비 정책 삭제 핸들러
  const onDeleteConfirm = useCallback(
    () =>
      mutateAsync({ groupId: id })
        .then(() => {
          toast({
            title: '배송비 정책 삭제 성공',
            status: 'success',
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: '배송비 정책 삭제 오류',
            status: 'error',
          });
        }),
    [id, mutateAsync, toast],
  );
  return (
    <>
      <Grid templateColumns="repeat(9, 1fr)" mb={1}>
        {/* 배송그룹명 */}
        <GridItem colSpan={4}>
          <Button
            variant="link"
            onClick={onInfoModalOpen}
            isFullWidth
            textDecoration="underline"
          >
            <Text isTruncated>{`${shipping_group_name}`}</Text>
          </Button>
        </GridItem>

        {/* 배송비 계산 기준 */}
        <GridItem colSpan={3}>
          <Text>{`${ShippingCalculTypeOptions[shipping_calcul_type].label}`}</Text>
        </GridItem>

        {/* 연결된 상품 */}
        <GridItem colSpan={1}>
          {_count.goods > 0 ? (
            <Button
              variant="link"
              onClick={onRelatedGoodsModalOpen}
              isFullWidth
              textDecoration="underline"
            >
              <Text>{`${_count.goods}`}</Text>
            </Button>
          ) : (
            <Text align="center">{`${_count.goods}`}</Text>
          )}
        </GridItem>

        {/* 삭제버튼 */}
        <GridItem>
          <CloseButton size="sm" onClick={onConfirmModalOpen} />
        </GridItem>
      </Grid>

      {/* 배송비정책 삭제 확인 다이얼로그 */}
      <ShippingGroupDeleteConfirmDialog
        isOpen={confirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={onDeleteConfirm}
      />

      {/* 배송비 정책 상세보기 모달 */}
      <ShippingGroupDetailModal
        isOpen={infoModalOpen}
        onClose={onInfoModalClose}
        onConfirm={() => {
          if (!id) throw new Error('shippingGroupId가 없습니다');
          return Promise.resolve();
        }}
        groupId={id}
      />

      {/* 연결된 상품 확인 모달 */}
      <ShippingGroupRelatedItemsDialog
        isOpen={relatedGoodsModalOpen}
        onClose={onRelatedGoodsModalClose}
        onConfirm={() => {
          if (!id) throw new Error('shippingGroupId가 없습니다');
          return Promise.resolve();
        }}
        groupId={id}
      />
    </>
  );
}

export function ShopInfoShippingGroup(): JSX.Element {
  const { data, isLoading } = useSellerShippingGroupList();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return (
      <SettingSectionLayout title="배송비 정책">
        <Center>
          <Spinner />
        </Center>
      </SettingSectionLayout>
    );
  }
  return (
    <SettingSectionLayout title="배송비 정책">
      {/* 배송비 정책 생성버튼 */}
      <Button width="200px" onClick={onOpen}>
        배송비정책 생성하기
      </Button>

      {/* 배송비 정책 생성 다이얼로그 */}
      <ShippingGroupRegistDialog isOpen={isOpen} onClose={onClose} onSuccess={onClose} />

      {/* 배송비 정책 목록 컨테이너 */}
      <ShippingGroupContainerBox>
        {/* 생성된 배송비 정책 없는경우 */}
        {(!data || data.length === 0) && <Text>등록된 배송비 정책이 없습니다. </Text>}
        {/* 배송비 정책 목록 */}
        {data && data.map((g) => <ShopInfoShippingPolicyItem key={g.id} group={g} />)}
      </ShippingGroupContainerBox>
    </SettingSectionLayout>
  );
}

export default ShopInfoShippingGroup;
