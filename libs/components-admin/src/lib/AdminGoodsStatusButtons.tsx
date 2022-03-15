// 검수 승인 및 거절 버튼 그룹

import { Grid, useDisclosure, Button } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { AdminGoodsByIdRes } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AdminGoodsConfirmationDialog } from './AdminGoodsConfirmationDialog';
import AdminGoodsRejectionDialog from './AdminGoodsRejectionDialog';

export function AdminGoodsStatusButtons(props: {
  goods: AdminGoodsByIdRes;
}): JSX.Element {
  const { goods } = props;
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRejecionOpen,
    onOpen: onRejectionOpen,
    onClose: onRejectionClose,
  } = useDisclosure();

  const goodsRowData = useMemo(
    () => ({
      id: goods.id,
      goods_name: goods.goods_name,
      name: goods.seller.name || '',
      agreementFlag: goods.seller.agreementFlag,
    }),
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
        callback={() => router.push('/goods/confirmation')}
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
