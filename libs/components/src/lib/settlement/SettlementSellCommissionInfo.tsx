import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSellCommission, useUpdateSellCommissionMutation } from '@project-lc/hooks';
import { ChangeSellCommissionDto } from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';

export function SettlementSellCommissionInfo(): JSX.Element {
  const toast = useToast();
  const commissionInfo = useSellCommission();
  const { mutateAsync } = useUpdateSellCommissionMutation();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeSellCommissionDto>();

  const onSubmit = async (formData: ChangeSellCommissionDto): Promise<void> => {
    mutateAsync(formData)
      .then(() => {
        toast({ title: '기본 판매 수수료율 변경 성공', status: 'success' });
        onClose();
      })
      .catch(() => toast({ title: '기본 판매 수수료율 변경 실패', status: 'error' }));
  };

  return (
    <Box>
      <Text fontWeight="bold">수수료율 정보</Text>
      <HStack>
        <Text>{`기본 판매 수수료율 : ${commissionInfo.data?.commissionRate}%`}</Text>
        <Button size="sm" onClick={onOpen}>
          변경하기
        </Button>
      </HStack>
      <Text>라이브쇼핑을 통한 판매 수수료율 : 각 라이브 쇼핑 수수료 정보에 따름.</Text>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>기본 판매 수수료율 변경</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.commissionRate} isRequired>
              <FormLabel>기본 판매 수수료율</FormLabel>
              <InputGroup>
                <Input
                  {...register('commissionRate', {
                    min: { value: 0, message: '수수료율은 0보다 작을 수 없습니다.' },
                    max: { value: 100, message: '수수료율은 100보다 클 수 없습니다.' },
                  })}
                />
                <InputRightAddon>%</InputRightAddon>
              </InputGroup>
              {errors.commissionRate && (
                <FormErrorMessage>{errors.commissionRate.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={2} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" type="submit">
              변경
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SettlementSellCommissionInfo;
