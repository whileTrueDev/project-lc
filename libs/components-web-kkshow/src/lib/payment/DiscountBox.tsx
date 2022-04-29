import {
  Box,
  Heading,
  Input,
  Text,
  Flex,
  Button,
  FormErrorMessage,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useKkshowOrderStore } from '@project-lc/stores';

export function DiscountBox(): JSX.Element {
  const MAX_MILEAGE = 1100;
  const {
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = useFormContext<any>();
  const { handleMileageDiscount } = useKkshowOrderStore();
  const toast = useToast();
  return (
    <Flex direction="column" justifyContent="space-evenly" h="xs">
      <Heading>할인/적립금</Heading>
      <Flex direction="column">
        <Text mb={3}>쿠폰할인</Text>
        <Flex alignItems="flex-end">
          <Text>상품/주문 쿠폰</Text>
          <Input variant="flushed" disabled size="xs" w="20%" />
          <Button size="xs">쿠폰사용</Button>
        </Flex>
      </Flex>
      <Flex direction="column">
        <Text mb={3}>적립금</Text>
        <Flex alignItems="flex-end">
          <Text>보유</Text>
          <Input variant="flushed" disabled size="xs" w="20%" value={MAX_MILEAGE} />
        </Flex>
        <Flex alignItems="flex-end">
          <Text>사용</Text>
          <Input
            variant="flushed"
            size="xs"
            w="20%"
            type="number"
            {...register('mileage', {
              max: MAX_MILEAGE,
              valueAsNumber: true,
              pattern: {
                value: /^[0-9]+$/,
                message: '마일리지는 숫자만 가능합니다.',
              },
              onBlur: (e) => {
                if (e.target.value <= MAX_MILEAGE) {
                  handleMileageDiscount(e.target.value);
                } else {
                  setValue('mileage', MAX_MILEAGE);
                  toast({
                    title: '보유 금액 이상 사용은 불가능 합니다.',
                    status: 'error',
                  });
                }
              },
              validate: (value: number) => value <= MAX_MILEAGE || 'ErrorError',
            })}
          />
          <Button
            size="xs"
            onClick={() => {
              setValue('mileage', MAX_MILEAGE);
            }}
          >
            전액사용
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
