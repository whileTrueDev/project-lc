import {
  Box,
  Input,
  Button,
  Text,
  HStack,
  useToast,
  FormControl,
} from '@chakra-ui/react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useCustomerInfoMutation } from '@project-lc/hooks';
import { useForm } from 'react-hook-form';
import { parseErrorObject } from '@project-lc/utils-frontend';
import { UpdateCustomerDto } from '@project-lc/shared-types';

export function CustomerBirthday(props: {
  birthDate: UpdateCustomerDto['birthDate'];
  userId: number;
}): JSX.Element {
  const { birthDate, userId } = props;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ birthDate: UpdateCustomerDto['birthDate'] }>();

  const { mutateAsync } = useCustomerInfoMutation(userId);

  const onSubmit = (formData: { birthDate: UpdateCustomerDto['birthDate'] }): void => {
    const onSuccess = (): void => {
      // 성공시
      reset();
      toast({ title: '생일이 변경되었습니다.', status: 'success' });
      setIsEditMode(false);
    };
    const onError = (err?: any): void => {
      const { status, message } = parseErrorObject(err);
      toast({
        title: '생일 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        description: status ? `code: ${status} - message: ${message}` : undefined,
        status: 'error',
      });
    };

    mutateAsync({ birthDate: formData.birthDate })
      .then((result) => {
        if (result) onSuccess();
        else onError();
      })
      .catch((err) => {
        console.log(err);
        onError(err);
      });
  };

  return (
    <Box>
      {!isEditMode ? (
        <HStack>
          <Text>{birthDate ? dayjs(birthDate).format('YYYY-MM-DD') : ''}</Text>
          <Button size="xs" onClick={() => setIsEditMode(true)}>
            {birthDate ? '변경' : '등록'}
          </Button>
        </HStack>
      ) : (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.birthDate}>
            <HStack>
              <Input type="date" w="30%" size="xs" {...register('birthDate')} />
              <Button size="xs" type="submit" colorScheme="blue">
                저장
              </Button>
              <Button size="xs" onClick={() => setIsEditMode(false)}>
                취소
              </Button>
            </HStack>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
