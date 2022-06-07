import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useAdminCustomerCouponPatchMutation } from '@project-lc/hooks';
import { useState } from 'react';
import { CouponStatus } from '@prisma/client';
import { GridRowData } from '@material-ui/data-grid';

type AdminCustomerCouponStatusDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  data: GridRowData;
};

export function AdminCustomerCouponStatusDialog(
  props: AdminCustomerCouponStatusDialogProps,
): JSX.Element {
  const { isOpen, onClose, data } = props;
  const toast = useToast();
  const [status, setStatus] = useState<CouponStatus>('notUsed');
  const { mutateAsync } = useAdminCustomerCouponPatchMutation();

  const handleSubmit = (): void => {
    mutateAsync({ status, id: data.id })
      .then(() => {
        toast({
          description: '변경 완료',
          status: 'success',
        });
        onClose();
      })
      .catch(() => {
        toast({
          description: '변경 실패',
          status: 'error',
        });
      });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>쿠폰관리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="쿠폰의 상태를 수정하세요"
              onChange={(e) => {
                setStatus(e.target.value as CouponStatus);
              }}
            >
              <option value="expired">만료됨</option>
              <option value="used">사용됨</option>
              <option value="notUsed">사용전</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
