import { useToast, Text } from '@chakra-ui/react';
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { useOrderPurchaseConfirmMutation } from '@project-lc/hooks';

export interface PurchaseConfirmDialogProps
  extends Pick<ConfirmDialogProps, 'isOpen' | 'onClose'> {
  orderItemOptionId: number;
}
export function PurchaseConfirmDialog({
  isOpen,
  onClose,
  orderItemOptionId,
}: PurchaseConfirmDialogProps): JSX.Element {
  const toast = useToast();
  const orderPurchaseMutation = useOrderPurchaseConfirmMutation();
  // 구매확정 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    orderPurchaseMutation
      .mutateAsync({ orderItemOptionId })
      .then(() => {
        toast({ title: '구매 확정 완료', status: 'success' });
      })
      .catch((e) => {
        toast({
          title: '구매 확정 중 오류가 발생하였습니다.',
          status: 'error',
          description: e.code,
        });
      });
  };

  return (
    <ConfirmDialog
      title="구매확정하기"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={purchaseConfirmRequest}
      isLoading={orderPurchaseMutation.isLoading}
    >
      <Text>
        구매확정시 후원방송인에게 후원금이 적립되며 <br />
        교환 및 환불이 어렵습니다.
      </Text>
    </ConfirmDialog>
  );
}

export default PurchaseConfirmDialog;
