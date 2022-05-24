import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  HStack,
  RadioGroup,
  Radio,
  Flex,
  FormControl,
  FormErrorMessage,
  useToast,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { adminMileageManageStore } from '@project-lc/stores';
import { useForm } from 'react-hook-form';
import { CustomerMileageDto } from '@project-lc/shared-types';
import { useAdminMileageMutation } from '@project-lc/hooks';
import { parseErrorObject } from '@project-lc/utils-frontend';

type AdminMileageManageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminMileageManageDialog(
  props: AdminMileageManageDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  const { mileage } = adminMileageManageStore();
  const { mutateAsync } = useAdminMileageMutation(mileage?.customerId);
  const toast = useToast();
  const methods = useForm<CustomerMileageDto>({
    defaultValues: { mileage: 0, actionType: 'earn', reason: '' },
  });

  const handleRadio = (value: CustomerMileageDto['actionType']): void => {
    setValue('actionType', value);
  };

  const handleDialogClose = (): void => {
    reset();
    onClose();
  };

  const actionType = {
    earn: '적립',
    consume: '차감',
  };

  const onSubmit = (formData: CustomerMileageDto): void => {
    mutateAsync(formData)
      .then(() => {
        toast({ title: '변경 완료', status: 'success' });
        reset();
        onClose();
      })
      .catch((err) => {
        const { status, message } = parseErrorObject(err);

        toast({
          title: '변경 실패',
          description: status ? `code: ${status} - message: ${message}` : undefined,
          status: 'error',
        });
      });
  };

  const getMileageAfterUpdate = (): number => {
    let result;
    if (watch('actionType') === 'earn') {
      result = Number(mileage?.mileage) + Number(watch('mileage'));
    } else {
      result = Number(mileage?.mileage) - Number(watch('mileage'));
    }
    return result;
  };

  const getMileageAfterUpdateElement = (): JSX.Element => {
    const resultMileage = getMileageAfterUpdate();
    if (resultMileage < 0) {
      return <Text color="red">차감하려는 마일리지가 현재 보유액보다 큽니다</Text>;
    }
    return <Text>{resultMileage.toLocaleString()}</Text>;
  };

  const {
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleDialogClose} size="2xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>마일리지 관리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <Text>대상 이메일 :</Text>
              <Text fontWeight="bold">{mileage?.customer.email}</Text>
            </HStack>
            <HStack>
              <Text>현재 보유액 :</Text>
              <Text fontWeight="bold">{mileage?.mileage}</Text>
            </HStack>
            <RadioGroup
              defaultValue="earn"
              onChange={(value) => handleRadio(value as CustomerMileageDto['actionType'])}
            >
              <HStack>
                <Radio value="earn">적립</Radio>
                <Radio value="consume" colorScheme="red">
                  차감
                </Radio>
              </HStack>
            </RadioGroup>
            <Flex direction="column">
              <Text>금액</Text>
              <Input type="number" {...register('mileage', { valueAsNumber: true })} />

              <FormControl isInvalid={!!errors.reason}>
                <Text>사유</Text>
                <Input type="text" {...register('reason', { required: true })} />
                <FormErrorMessage>사유를 입력해주세요</FormErrorMessage>
              </FormControl>
              <Box mt={2} p={3} bgColor={useColorModeValue('gray.300', 'gray.600')}>
                <Text>{actionType[watch('actionType')]} 이후, 총액</Text>
                <Text fontWeight="bold" fontSize="xl">
                  {getMileageAfterUpdateElement()}
                </Text>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleDialogClose}>
              닫기
            </Button>
            <Button colorScheme="blue" type="submit">
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminMileageManageDialog;
