import {
  Button,
  Center,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  ShippingGroupListItemType,
  useDeleteShippingGroup,
  useProfile,
  useSellerGoodsList,
  useSellerShippingGroupList,
  useShippingGroupItem,
} from '@project-lc/hooks';
import {
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  ShippingCalculTypeOptions,
  TempShippingOption,
  TempShippingSet,
} from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
import NextLink from 'next/link';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { boxStyle } from '../constants/commonStyleProps';
import { GOODS_VIEW } from '../constants/goodsStatus';
import { ConfirmDialog, ConfirmDialogProps } from './ConfirmDialog';
import { GoodsFormValues } from './GoodsRegistForm';
import SectionWithTitle from './SectionWithTitle';
import ShippingPolicyForm from './ShippingPolicyForm';
import SetItem from './ShippingPolicySetListItem';

// 배송비 정책 상세 정보
function ShippingGroupDetail({ groupId }: { groupId: number | null }): JSX.Element {
  const { data, isLoading } = useShippingGroupItem(groupId);
  if (!groupId) return <Text>잘못된 접근입니다. 선택된 배송비정책 id 없음</Text>;
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!data) return <Text>배송비 정책에 대한 정보가 없습니다</Text>;
  const {
    shipping_group_name,
    shipping_calcul_type,
    baseAddress,
    postalCode,
    detailAddress,
    shippingSets,
  } = data;

  // 타입 맞추기 위한 데이터 형태 변경
  const sets: TempShippingSet[] = shippingSets.map((set) => {
    const {
      id,
      shippingOptions,
      refund_shiping_cost,
      swap_shiping_cost,
      ...restSetData
    } = set;
    const tempOptions: TempShippingOption[] = shippingOptions.map((opt) => {
      const { id: optId, shippingCost, ...restOptData } = opt;
      const { shipping_cost, shipping_area_name } = shippingCost[0];
      return {
        tempId: optId,
        shippingCost: { shipping_cost: Number(shipping_cost), shipping_area_name },
        ...restOptData,
      };
    });
    return {
      tempId: id,
      shippingOptions: tempOptions,
      refund_shiping_cost: Number(refund_shiping_cost),
      swap_shiping_cost: Number(swap_shiping_cost),
      ...restSetData,
    };
  });
  return (
    <Stack>
      <Text> 배송정책 이름 : {shipping_group_name}</Text>
      <Text>
        배송비 계산 기준 : {ShippingCalculTypeOptions[shipping_calcul_type].label}
      </Text>
      <Text>반송지 : {`${baseAddress} ${detailAddress} (${postalCode})`}</Text>
      {sets.map((set) => (
        <SetItem key={set.tempId} set={set} />
      ))}
    </Stack>
  );
}

// 연결된 상품 목록
function RelatedGoodsList({ groupId }: { groupId: number | null }): JSX.Element {
  const { data: profileData } = useProfile();
  const { data, isLoading } = useSellerGoodsList(
    {
      page: 0,
      itemPerPage: 100,
      sort: SellerGoodsSortColumn.REGIST_DATE,
      direction: SellerGoodsSortDirection.DESC,
      groupId: groupId || undefined,
      email: profileData?.email || '',
    },
    {
      enabled: !!profileData?.email && !!groupId,
    },
  );

  if (!groupId) return <Text>잘못된 접근입니다. 선택된 배송비정책 id 없음</Text>;
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <>
      <Text fontSize="sm" mb={1}>
        상품명을 클릭하면 해당 상품의 상세보기 페이지로 이동합니다
      </Text>
      {data &&
        data.items.map((item) => {
          const { id, goods_name, goods_view } = item;
          return (
            <HStack key={item.id}>
              <Text>{id}</Text>
              <NextLink href={`/mypage/goods/${id}`} passHref>
                <Link isExternal>
                  <Text isTruncated>{goods_name}</Text>
                </Link>
              </NextLink>
              <Text>{GOODS_VIEW[goods_view]}</Text>
            </HStack>
          );
        })}
    </>
  );
}

// 생성된 배송비 그룹 아이템 - 상품등록 페이지에서만 사용(라디오버튼이 있음)
function ShippingGroupListItem({
  group,
  nameHandler,
  countHandler,
  deleteHandler,
}: {
  group: ShippingGroupListItemType;
  nameHandler: (id: number) => void;
  countHandler: (id: number) => void;
  deleteHandler: (id: number) => void;
}): JSX.Element {
  const { register } = useFormContext<GoodsFormValues>();
  return (
    <Flex key={group.id} spacing={2}>
      {/* 라디오버튼 */}
      <Radio
        width="10%"
        {...register('shippingGroupId', { valueAsNumber: true })}
        value={String(group.id)} // String으로 안바꾸면 라디오 선택이 안됨... 왜???
      />

      {/* 배송그룹명 */}
      <Button
        variant="link"
        color="teal.500"
        textDecoration="underline"
        width="30%"
        onClick={() => {
          nameHandler(group.id);
        }}
      >
        <Text isTruncated>
          {group.shipping_group_name}({group.id})
        </Text>
      </Button>

      {/* 배송비 계산 기준 */}
      <Text width="30%" textAlign="center">
        {ShippingCalculTypeOptions[group.shipping_calcul_type].label}
      </Text>

      {/* 연결된 상품 */}
      {group._count.goods > 0 ? (
        <Button
          textAlign="center"
          width="30%"
          variant="link"
          color="teal.500"
          textDecoration="underline"
          onClick={() => {
            countHandler(group.id);
          }}
        >
          {group._count.goods}
        </Button>
      ) : (
        <Text width="30%" textAlign="center">
          {group._count.goods}
        </Text>
      )}

      {/* 삭제버튼 */}
      <CloseButton
        size="sm"
        onClick={() => {
          deleteHandler(group.id);
        }}
      />
    </Flex>
  );
}

/* 배송비 정책 상세보기 모달 */
export function ShippingGroupDetailModal(
  props: Pick<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'> & {
    groupId: number | null;
  },
): JSX.Element {
  const { isOpen, onClose, onConfirm, groupId } = props;
  return (
    <ConfirmDialog
      title="배송비 정책 정보"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ShippingGroupDetail groupId={groupId} />
    </ConfirmDialog>
  );
}

/** 배송비 정책에 연결된 상품 보기 모달 */
export function ShippingGroupRelatedItemsDialog(
  props: Pick<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'> & {
    groupId: number | null;
  },
): JSX.Element {
  const { isOpen, onClose, onConfirm, groupId } = props;
  return (
    <ConfirmDialog
      title="연결된 상품"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <RelatedGoodsList groupId={groupId} />
    </ConfirmDialog>
  );
}

/** 배송비 정책 생성 모달 */
export function ShippingGroupRegistDialog({
  isOpen,
  onClose,
  onSuccess,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  onSuccess: () => void;
}): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody maxW="4xl" mx="auto">
          <ShippingPolicyForm onSuccess={onSuccess} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/** 배송비 정책 삭제 확인 모달 */
export function ShippingGroupDeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  onConfirm: () => Promise<any>;
}): JSX.Element {
  return (
    <ConfirmDialog
      title="배송비 정책 삭제"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Text>해당 배송비 그룹을 삭제하시겠습니까? 삭제 후 복구가 불가능합니다</Text>
    </ConfirmDialog>
  );
}

export function GoodsRegistShippingPolicy(): JSX.Element {
  const {
    isOpen: registModalOpen,
    onOpen: onRegistModalOpen,
    onClose: onRegistModalClose,
  } = useDisclosure();
  const {
    isOpen: confirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();
  const {
    isOpen: relatedGoodsModalOpen,
    onOpen: onRelatedGoodsModalOpen,
    onClose: onRelatedGoodsModalClose,
  } = useDisclosure();
  const {
    isOpen: infoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure();

  const { watch, setValue } = useFormContext<GoodsFormValues>();

  const { data } = useSellerShippingGroupList();
  const [clickedGroupId, setClickedGroupId] = useState<null | number>(null);
  const toast = useToast();

  const { reset } = useShippingGroupItemStore();
  const { mutateAsync } = useDeleteShippingGroup();

  const registModalCloseHandler = (): void => {
    reset();
    onRegistModalClose();
  };

  const groupItemNameHandler = (id: number): void => {
    setClickedGroupId(id);
    onInfoModalOpen();
  };
  const groupItemCountHandler = (id: number): void => {
    setClickedGroupId(id);
    onRelatedGoodsModalOpen();
  };
  const groupItemDeleteHandler = (id: number): void => {
    setClickedGroupId(id);
    onConfirmModalOpen();
  };

  return (
    <SectionWithTitle title="배송비 *">
      <HStack mb={4}>
        <Text>배송비 정책을 {data && data.length === 0 ? '생성' : '선택'}해주세요</Text>
        <Button onClick={onRegistModalOpen}>생성하기</Button>
      </HStack>

      {/* 배송비 정책 목록 */}
      <Stack spacing={2} maxWidth="lg" {...boxStyle}>
        <Flex fontSize="sm">
          <Spacer />
          <Text>배송그룹명 ( 번호 )</Text>
          <Spacer />
          <Text>배송비 계산 기준</Text>
          <Spacer />
          <Text>연결된 상품</Text>
          <Spacer />
        </Flex>
        <Divider />
        <RadioGroup value={watch('shippingGroupId')} maxHeight="150px" overflowY="auto">
          {data &&
            data.map((g) => (
              <ShippingGroupListItem
                key={g.id}
                group={g}
                nameHandler={groupItemNameHandler}
                countHandler={groupItemCountHandler}
                deleteHandler={groupItemDeleteHandler}
              />
            ))}
        </RadioGroup>
      </Stack>

      {/* 배송비 정책 상세보기 모달 */}
      <ShippingGroupDetailModal
        isOpen={infoModalOpen}
        onClose={onInfoModalClose}
        onConfirm={() => {
          const groupId = clickedGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          setClickedGroupId(null);
          return Promise.resolve();
        }}
        groupId={clickedGroupId}
      />

      {/* 연결된 상품 확인 모달 */}
      <ShippingGroupRelatedItemsDialog
        isOpen={relatedGoodsModalOpen}
        onClose={onRelatedGoodsModalClose}
        onConfirm={() => {
          const groupId = clickedGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          setClickedGroupId(null);
          return Promise.resolve();
        }}
        groupId={clickedGroupId}
      />

      {/* 배송비 정책 삭제 확인 모달 */}
      <ShippingGroupDeleteConfirmDialog
        isOpen={confirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={() => {
          const groupId = clickedGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          return mutateAsync({ groupId })
            .then((res) => {
              setClickedGroupId(null);
              setValue('shippingGroupId', undefined);
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
            });
        }}
      />

      {/* 배송비 정책 생성 모달 */}
      <ShippingGroupRegistDialog
        isOpen={registModalOpen}
        onClose={registModalCloseHandler}
        onSuccess={registModalCloseHandler}
      />
    </SectionWithTitle>
  );
}

export default GoodsRegistShippingPolicy;
