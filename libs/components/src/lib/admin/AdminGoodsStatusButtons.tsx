// 검수 승인 및 거절 버튼 그룹

import { Grid, useToast, useDisclosure, Button } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { GoodsConfirmationStatus, GoodsByIdRes } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useGoodRejectionMutation } from '@project-lc/hooks';
import { useMemo } from 'react';
import { AdminGoodsConfirmationDialog } from './AdminGoodsConfirmationDialog';
import AdminGoodsRejectionDialog from './AdminGoodsRejectionDialog';

export function AdminGoodsStatusButtons(props: { goods: GoodsByIdRes }): JSX.Element {
  const { goods } = props;
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRejecionOpen,
    onOpen: onRejectionOpen,
    onClose: onRejectionClose,
  } = useDisclosure();
  const rejectMutation = useGoodRejectionMutation();

  async function handleRejectionGood(row: any): Promise<void> {
    try {
      await rejectMutation.mutateAsync({
        goodsId: row.id,
        status: GoodsConfirmationStatus.REJECTED,
      });
      toast({
        title: '상품이 반려되었습니다.',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '상품 반려가 실패하였습니다.',
        status: 'error',
      });
    } finally {
      router.push('/goods');
    }
  }

  const goodsRowData = useMemo(
    () => ({ id: goods.id, goods_name: goods.goods_name }),
    [goods],
  );

  return (
    <>
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Button
          size="sm"
          color="green.400"
          leftIcon={<CheckIcon />}
          onClick={() => onOpen()}
        >
          검수 승인
        </Button>
        <Button
          size="sm"
          color="red.400"
          leftIcon={<CloseIcon />}
          onClick={() => onRejectionOpen()}
        >
          검수 반려
        </Button>
      </Grid>
      {/* 검수 승인 다이얼로그 - 퍼스트몰 상품 id 입력 */}
      <AdminGoodsConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        row={goodsRowData}
        callback={() => router.push('/goods')}
      />
      {/* 검수 반려 다이얼로그 - 반려사유 입력 */}
      <AdminGoodsRejectionDialog
        isOpen={isRejecionOpen}
        onClose={onRejectionClose}
        row={goodsRowData}
      />
    </>
  );
}
