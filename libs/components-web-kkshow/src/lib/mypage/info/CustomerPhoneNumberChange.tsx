import {
  Box,
  Text,
  Button,
  HStack,
  Input,
  FormControl,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCustomerInfoMutation } from '@project-lc/hooks';

type CustomerPhoneNumberChageProps = { data: string; userId: number };

export function CustomerPhoneNumberChage(
  props: CustomerPhoneNumberChageProps,
): JSX.Element {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { data, userId } = props;
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ phone1: string; phone2: string; phone3: string }>();
  const { mutateAsync } = useCustomerInfoMutation(userId);
  const onSubmit = (formData: {
    phone1: string;
    phone2: string;
    phone3: string;
  }): void => {
    const onSuccess = (): void => {
      // 성공시
      reset();
      toast({ title: '휴대전화번호가 변경되었습니다.', status: 'success' });
      setIsEditMode(false);
    };
    const onError = (err?: any): void => {
      toast({
        title: '휴대전화번호 변경중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        status: 'error',
      });
    };

    const fullPhoneNumber = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;

    mutateAsync({ phone: fullPhoneNumber })
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
    <>
      {!isEditMode ? (
        <HStack>
          <Text>{data}</Text>
          <Button
            size="xs"
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            {data ? '수정' : '등록'}
          </Button>
        </HStack>
      ) : (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.phone1 || !!errors.phone2 || !!errors.phone3}>
            <HStack>
              <Input
                size="xs"
                w="10%"
                {...register('phone1', { minLength: 3, maxLength: 3, required: true })}
              />
              <Text>-</Text>
              <Input
                size="xs"
                w="10%"
                {...register('phone2', { minLength: 3, maxLength: 4, required: true })}
              />
              <Text>-</Text>
              <Input
                size="xs"
                w="10%"
                {...register('phone3', { minLength: 4, maxLength: 4, required: true })}
              />
              <Button size="xs" type="submit" colorScheme="blue">
                변경
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  reset();
                  setIsEditMode(false);
                }}
              >
                취소
              </Button>
            </HStack>
            <FormErrorMessage>휴대전화번호를 확인해주세요</FormErrorMessage>
          </FormControl>
        </Box>
      )}
    </>
  );
}
