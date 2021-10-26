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
  Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useUpdateReturnStatusMutation } from '@project-lc/hooks';
import {
  FmOrderReturnBase,
  convertFmReturnStatusToString,
} from '@project-lc/shared-types';

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
      title: '반품 상태를 변경하였습니다',
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: '반품 상태 변경 중 오류가 발생하였습니다',
      status: 'error',
    });
  };

  function update(): void {
    const dto = { status: watch('status'), return_code: data.return_code };

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
            <Text size="lg" mb={4}>
              현재상태 : {convertFmReturnStatusToString(data.status)}
            </Text>
            {watch('status') === 'complete' && (
              <Stack bg="gray.200" mb={2} p={2} borderRadius={3}>
                <Text fontWeight="bold">
                  &#8251; 반품완료 선택시, 환불이 진행되므로 반드시 물품 수령 및 확인 후,
                  반품완료를 선택하세요.
                </Text>
                <Text color="tomato" fontWeight="bold">
                  &#8251; 반품 완료 등록 후, 이전 단계로의 변경은 불가합니다.
                </Text>
              </Stack>
            )}
            <Select
              placeholder="진행 단계를 선택하세요"
              {...register('status')}
              disabled={data.status === 'complete'}
            >
              <option value="request">반품요청</option>
              <option value="ing">반품진행중</option>
              <option value="complete">반품완료</option>
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
