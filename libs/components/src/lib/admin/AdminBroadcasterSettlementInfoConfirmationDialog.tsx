import {
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { useAdminBroadcasterSettlementInfoConfirmMutation } from '@project-lc/hooks';
import { GridTableItem } from '../GridTableItem';

export interface AdminBroadcasterSettlementInfoConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  row: GridRowData;
}
export function AdminBroadcasterSettlementInfoConfirmationDialog({
  isOpen,
  onClose,
  row,
}: AdminBroadcasterSettlementInfoConfirmationDialogProps): JSX.Element {
  const toast = useToast();

  const confirmationMutation = useAdminBroadcasterSettlementInfoConfirmMutation();

  const useSubmit = async (): Promise<void> => {
    try {
      await confirmationMutation.mutateAsync({ id: row.id, status: 'confirmed' });
      toast({
        title: '방송인의 정산정보가 승인되었습니다.',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: '방송인의 정산정보 승인이 실패하였습니다.',
        status: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>방송인 정산정보 승인 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="방송인 활동명" value={row?.broadcaster?.userNickname} />
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={useSubmit}>승인하기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminBroadcasterSettlementInfoConfirmationDialog;
