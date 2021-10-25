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
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useUpdateReturnStatusMutation } from '@project-lc/hooks';
import { FmOrderReturnBase } from '@project-lc/shared-types';

function returnStatusSwitch(value: string): string {
  switch (value) {
    case 'request':
      return '반품 신청';
    case 'ing':
      return '반품 신청 승인';
    case 'complete':
      return '반품 물품 도착';
    default:
      return '';
  }
}

export function OrderReturnStatusDialog(props: {
  isOpen: boolean;
  onClose: () => void;
  data: FmOrderReturnBase;
}): JSX.Element {
  const { isOpen, onClose, data } = props;
  const { watch, register } = useForm();
  const { mutateAsync } = useUpdateReturnStatusMutation();
  const toast = useToast();
  const onSuccess = (): void => {
    toast({
      title: '상품을 성공적으로 등록하였습니다',
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: '상품 등록 중 오류가 발생하였습니다',
      status: 'error',
    });
  };

  function update(): void {
    const dto = { status: watch('status'), returnCode: data.return_code };

    mutateAsync(dto).then(onSuccess).catch(onFail);
    onClose();
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>반품 상태 관리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>현재상태 : {returnStatusSwitch(data.status)}</Text>
            <Text>
              반품 물품 도착 선택시, 환불이 진행되므로 반드시 물품 수령 및 확인 후, 반품
              물품 도착을 선택하세요
            </Text>
            <Select placeholder="진행 단계를 선택하세요" {...register('status')}>
              <option value="request">반품 신청</option>
              <option value="ing">반품 신청 승인</option>
              <option value="complete">반품 물품 도착</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={update}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default OrderReturnStatusDialog;
