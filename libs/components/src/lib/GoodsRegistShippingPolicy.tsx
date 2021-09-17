/* eslint-disable react/jsx-props-no-spreading */
import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
  RadioGroup,
  Radio,
  CloseButton,
} from '@chakra-ui/react';
import {
  useDeleteShippingGroup,
  useProfile,
  useShippingGroupList,
} from '@project-lc/hooks';
import { useShippingGroupItemStore } from '@project-lc/stores';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ConfirmDialog } from './ConfirmDialog';
import { GoodsFormValues } from './GoodsRegistForm';
import SectionWithTitle from './SectionWithTitle';
import ShippingPolicyForm from './ShippingPolicyForm';

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
  const [deleteGroupId, setDeleteGroupId] = useState<null | number>(null);

  const { watch, control, register, setValue, getValues } =
    useFormContext<GoodsFormValues>();
  const { data: ProfileData } = useProfile();
  const { data, isLoading } = useShippingGroupList(
    ProfileData?.email || '',
    !!ProfileData,
  );

  const { reset } = useShippingGroupItemStore();
  const { mutateAsync } = useDeleteShippingGroup();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const closeHandler = () => {
    reset();
    onRegistModalClose();
  };

  return (
    <SectionWithTitle title="배송비">
      <HStack mb={4}>
        <Text>배송비 정책을 {data && data.length === 0 ? '생성' : '선택'}해주세요</Text>
        <Button onClick={onRegistModalOpen}>생성하기</Button>
      </HStack>

      {/* 배송비 정책 목록 */}
      <RadioGroup value={watch('shippingGroupId')}>
        {data &&
          data.map((g) => (
            <HStack key={g.id}>
              <Radio
                {...register('shippingGroupId')}
                value={String(g.id)} // String으로 안바꾸면 라디오 선택이 안됨... 왜???
              />
              <Text>
                배송그룹명(번호) : {g.shipping_group_name}({g.id}) ,
              </Text>
              <Text>배송비 계산 기준 : {g.shipping_calcul_type}, </Text>
              <Text>연결된 상품: {g._count.goods}</Text>
              <CloseButton
                size="sm"
                onClick={() => {
                  setDeleteGroupId(g.id);
                  onConfirmModalOpen();
                }}
              />
            </HStack>
          ))}
      </RadioGroup>

      {/* 배송비 정책 삭제 확인 모달 */}
      <ConfirmDialog
        title="배송비 정책 삭제"
        isOpen={confirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={() => {
          const groupId = deleteGroupId;
          if (!groupId) throw new Error('shippingGroupId가 없습니다');
          return mutateAsync({ groupId }).then(() => {
            setDeleteGroupId(null);
            setValue('shippingGroupId', undefined);
          });
        }}
      >
        <Text>해당 배송비 그룹을 삭제하시겠습니까? 삭제 후 복구가 불가능합니다</Text>
      </ConfirmDialog>

      {/* 배송비 정책 생성 모달 */}
      <Modal isOpen={registModalOptn} onClose={closeHandler} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody maxW="4xl" mx="auto">
            <ShippingPolicyForm onSuccess={closeHandler} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistShippingPolicy;
