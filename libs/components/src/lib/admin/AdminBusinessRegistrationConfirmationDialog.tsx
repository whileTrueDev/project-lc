import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/modal';
import { Grid, useToast } from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { useBusinessRegistrationConfirmationMutation } from '@project-lc/hooks';
import { GridTableItem } from '../GridTableItem';

export interface AdminGoodsRejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  row: GridRowData;
}

export function AdminBusinessRegistrationConfirmationDialog({
  isOpen,
  onClose,
  row,
}: AdminGoodsRejectionDialogProps): JSX.Element {
  const toast = useToast();

  const confirmationMutation = useBusinessRegistrationConfirmationMutation();

  const useSubmit = async (): Promise<void> => {
    try {
      await confirmationMutation.mutateAsync({ id: row.id });
      toast({
        title: '사업자등록정보가 승인되었습니다.',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: '사업자등록정보 승인이 실패하였습니다.',
        status: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>사업자등록정보 승인 하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
            <GridTableItem title="회사명" value={row?.companyName} />
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={useSubmit}>승인하기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
