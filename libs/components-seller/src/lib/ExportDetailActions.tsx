import { Box, Button, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { useDelieveryDoneMutation, useDelieveryStartMutation } from '@project-lc/hooks';
import { ExportRes } from '@project-lc/shared-types';

export interface ExportDetailActionsProps {
  exportData: ExportRes;
}
export function ExportDetailActions({
  exportData,
}: ExportDetailActionsProps): JSX.Element | null {
  const shippingStartDialog = useDisclosure();
  const shippingDoneDialog = useDisclosure();

  if (!exportData.exportCode) return null;
  return (
    <>
      {['exportDone', 'partialExportDone'].includes(exportData.status) ? (
        <>
          <Button onClick={shippingStartDialog.onOpen} colorScheme="purple">
            배송중처리
          </Button>
          <ExportShippingStartConfirmDialog
            exportCode={exportData.exportCode}
            isOpen={shippingStartDialog.isOpen}
            onClose={shippingStartDialog.onClose}
          />
        </>
      ) : null}

      {['shipping', 'partialShipping'].includes(exportData.status) ? (
        <>
          <Button onClick={shippingDoneDialog.onOpen} colorScheme="messenger">
            배송완료처리
          </Button>
          <ExportShippinDoneConfirmDialog
            exportCode={exportData.exportCode}
            isOpen={shippingDoneDialog.isOpen}
            onClose={shippingDoneDialog.onClose}
          />
        </>
      ) : null}
    </>
  );
}

export default ExportDetailActions;

type ExportShippingConfirmDialogProps = Pick<ConfirmDialogProps, 'isOpen' | 'onClose'> & {
  exportCode: NonNullable<ExportRes['exportCode']>;
};
function ExportShippingStartConfirmDialog({
  isOpen,
  onClose,
  exportCode,
}: ExportShippingConfirmDialogProps): JSX.Element {
  const toast = useToast();
  const { mutateAsync, isLoading } = useDelieveryStartMutation();
  const handleConfirm = async (): Promise<void> => {
    return mutateAsync({ exportCode, status: OrderProcessStep.shipping })
      .then(() => {
        toast({ title: '배송중 상태로 처리완료되었습니다.' });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '배송중 상태 처리 중 오류',
          description: err.response.data.message,
        });
      });
  };
  return (
    <ConfirmDialog
      title="배송중으로 처리"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      <Box>
        해당 출고를{' '}
        <Text as="span" color="purple">
          배송중
        </Text>{' '}
        상태로 처리하시겠습니까?
      </Box>
    </ConfirmDialog>
  );
}

function ExportShippinDoneConfirmDialog({
  isOpen,
  onClose,
  exportCode,
}: ExportShippingConfirmDialogProps): JSX.Element {
  const toast = useToast();
  const { mutateAsync, isLoading } = useDelieveryDoneMutation();
  const handleConfirm = async (): Promise<void> => {
    return mutateAsync({ exportCode, status: OrderProcessStep.shippingDone })
      .then(() => {
        toast({ title: '배송완료 상태로 처리완료되었습니다.' });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '배송완료 상태 처리 중 오류',
          description: err.response.data.message,
        });
      });
  };
  return (
    <ConfirmDialog
      title="배송완료로 처리"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    >
      <Box>
        해당 출고를{' '}
        <Text as="span" color="blue">
          배송완료
        </Text>{' '}
        상태로 처리하시겠습니까?
      </Box>
    </ConfirmDialog>
  );
}
