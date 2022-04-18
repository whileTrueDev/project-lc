import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Grid,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
import {
  useBusinessRegistrationConfirmationMutation,
  useAdminSellerSettlementHistoryMutation,
} from '@project-lc/hooks';

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
  const { mutateAsync: historyMutation } = useAdminSellerSettlementHistoryMutation();

  const useSubmit = async (): Promise<void> => {
    try {
      await confirmationMutation.mutateAsync({ id: row.id });

      if (row.mailOrderSalesImageName) {
        await Promise.all([
          historyMutation({
            type: 'businessRegistration',
            status: 'confirmed',
            sellerBusinessRegistrationId: row.id,
          }),
          historyMutation({
            type: 'mailOrder',
            status: 'confirmed',
            sellerBusinessRegistrationId: row.id,
          }),
        ]);
      } else {
        await historyMutation({
          type: 'businessRegistration',
          status: 'confirmed',
          sellerBusinessRegistrationId: row.id,
        });
      }
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
          {!row?.seller?.agreementFlag && (
            <Alert status="error">
              <Stack>
                <AlertIcon />
                <AlertTitle>이용동의를 하지 않은 사용자입니다</AlertTitle>
                <AlertDescription>
                  해당 판매자는 이용 약관에 동의를 하지 않았으므로 사업자 등록정보를
                  승인할 수 없습니다.
                </AlertDescription>
              </Stack>
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={!row?.seller?.agreementFlag} onClick={useSubmit}>
            승인하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
