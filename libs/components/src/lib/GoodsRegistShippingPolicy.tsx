
/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Center,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  ShippingGroupListItemType,
  useDeleteShippingGroup,
  useProfile,
  useSellerGoodsList,
  useShippingGroupItem,
  useShippingGroupList,
} from '@project-lc/hooks';
import {
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  ShippingCalculTypeOptions,
  TempShippingOption,
  TempShippingSet,
} from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
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
function ShippingGroupDetail({ groupId }: { groupId: number | null }) {
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

// TODO: 팝업 띄우는 게 아니라 groupId로 필터링 된 상품 목록 창으로 이동시키기
// 연결된 상품 목록
function RelatedGoodsList({ groupId }: { groupId: number | null }) {
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

// 생성된 배송비 그룹 아이템
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
}) {
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
) {
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

export function GoodsRegistShippingPolicy(): JSX.Element {
  const {
    isOpen: registModalOptn,
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
  const { data: ProfileData } = useProfile();
  const { data } = useShippingGroupList(ProfileData?.email || '', !!ProfileData);
  const [clickedGroupId, setClickedGroupId] = useState<null | number>(null);

  const { reset } = useShippingGroupItemStore();
  const { mutateAsync } = useDeleteShippingGroup();

  const registModalCloseHandler = () => {
    reset();
    onRegistModalClose();
  };

  const groupItemNameHandler = (id: number) => {
    setClickedGroupId(id);
    onInfoModalOpen();
  };
  const groupItemCountHandler = (id: number) => {
    setClickedGroupId(id);
    onRelatedGoodsModalOpen();
  };
  const groupItemDeleteHandler = (id: number) => {
    setClickedGroupId(id);
    onConfirmModalOpen();
  };

  return (
    <SectionWithTitle title="배송비 *">
      <HStack mb={4}>
        <Text>배송비 정책을 {data && data.length === 0 ? '생성' : '선택'}해주세요</Text>
        <Button onClick={onRegistModalOpen}>생성하기</Button>
      </HStack>

      {/* 배송비 정책 목록
       */}

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
      <ConfirmDialog
        title="연결된 상품"
        isOpen={relatedGoodsModalOpen}
        onClose={onRelatedGoodsModalClose}
        onConfirm={() => {
          const groupId = clickedGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          setClickedGroupId(null);
          return Promise.resolve();
        }}
      >
        <RelatedGoodsList groupId={clickedGroupId} />
      </ConfirmDialog>

      {/* 배송비 정책 삭제 확인 모달 */}
      <ConfirmDialog
        title="배송비 정책 삭제"
        isOpen={confirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={() => {
          const groupId = clickedGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          return mutateAsync({ groupId }).then(() => {
            setClickedGroupId(null);
            setValue('shippingGroupId', undefined);
          });
        }}
      >
        <Text>해당 배송비 그룹을 삭제하시겠습니까? 삭제 후 복구가 불가능합니다</Text>
      </ConfirmDialog>

      {/* 배송비 정책 생성 모달 */}
      <Modal isOpen={registModalOptn} onClose={registModalCloseHandler} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody maxW="4xl" mx="auto">
            <ShippingPolicyForm onSuccess={registModalCloseHandler} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistShippingPolicy;
