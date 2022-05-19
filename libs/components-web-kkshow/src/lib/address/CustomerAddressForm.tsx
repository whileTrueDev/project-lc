import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputProps,
  Stack,
  useMergeRefs,
} from '@chakra-ui/react';
import { DaumAddressDialogButton } from '@project-lc/components-shared/DaumAddressDialog';
import { CustomerAddressDto } from '@project-lc/shared-types';
import { useRef } from 'react';
import { AddressData } from 'react-daum-postcode';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface CustomerAddressFormProps {
  onSubmit: (formData: CustomerAddressDto) => void | Promise<void>;
  defaultValues?: Partial<CustomerAddressDto>;
}
export function CustomerAddressForm({
  onSubmit,
  defaultValues,
}: CustomerAddressFormProps): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<CustomerAddressDto>({ defaultValues });
  const detailAddress = register('detailAddress', {
    maxLength: { value: 20, message: '20자를 초과할 수 없습니다.' },
  });
  const _detailAddressRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useMergeRefs(detailAddress.ref, _detailAddressRef);
  const handleAddressSelected = (addressData: AddressData): void => {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    setValue('address', addr);
    clearErrors('address');
    setValue('postalCode', zonecode);
  };

  const _onSubmit: SubmitHandler<CustomerAddressDto> = (formData): void => {
    onSubmit(formData);
  };

  return (
    <Stack
      as="form"
      id="customer-contacts-form"
      onSubmit={handleSubmit(_onSubmit)}
      alignItems="flex-start"
    >
      <AddressFormField title="기본 배송지" errorMessage={errors.isDefault?.message}>
        <Checkbox size="lg" {...register('isDefault')} />
      </AddressFormField>
      <AddressFormField title="배송지 별칭" errorMessage={errors.title?.message}>
        <Input
          size="sm"
          maxW={200}
          placeholder="배송지 별칭"
          {...register('title', {
            required: '배송지 별칭을 입력해주세요',
            maxLength: { value: 15, message: '최대 15자까지 작성할 수 있습니다.' },
          })}
        />
      </AddressFormField>

      <AddressFormField title="수령인" errorMessage={errors.recipient?.message}>
        <Input
          placeholder="수령인"
          maxW={200}
          size="sm"
          {...register('recipient', {
            required: '수령인을 입력해주세요.',
            minLength: { value: 2, message: '수령인을 2글자 이상 작성해주세요.' },
            maxLength: 17,
          })}
        />
      </AddressFormField>

      <AddressFormField title="연락처" errorMessage={errors.phone?.message}>
        <Input
          maxW={200}
          placeholder="01012345678"
          type="number"
          size="sm"
          {...register('phone', {
            required: '휴대전화를 입력해주세요.',
            maxLength: {
              value: 12,
              message: '휴대전화를 올바르게 입력해주세요.',
            },
          })}
        />
        <FormHelperText fontSize="xs">- 를 제외한 숫자만 작성해주세요.</FormHelperText>
      </AddressFormField>

      <AddressFormField
        title="주소"
        errorMessage={errors.postalCode?.message || errors.address?.message}
      >
        <Stack>
          <DaumAddressDialogButton
            onAddressSelect={handleAddressSelected}
            finalFocusRef={_detailAddressRef}
          />
          <Flex gap={1}>
            <Input
              maxW={90}
              isReadOnly
              size="sm"
              placeholder="우편번호"
              {...register('postalCode', {
                required: '주소찾기를 통해 주소를 입력해주세요.',
              })}
            />
            <Input
              isReadOnly
              size="sm"
              placeholder="주소"
              {...register('address', {
                required: '주소찾기를 통해 주소를 입력해주세요.',
              })}
            />
          </Flex>
          <Input
            size="sm"
            placeholder="상세주소"
            {...detailAddress}
            ref={detailAddressRef}
          />
        </Stack>
      </AddressFormField>

      <AddressFormField title="배송메모" errorMessage={errors.memo?.message}>
        <Input
          placeholder="배송메모"
          size="sm"
          {...register('memo', {
            required: '배송메모를 입력해주세요.',
            maxLength: {
              value: 30,
              message: '배송메모는 30자를 초과할 수 없습니다.',
            },
          })}
        />
        <FormHelperText fontSize="xs">
          예) 문 앞 / 직접 받고 부재 시 문 앞 / 경비실 / 택배함
        </FormHelperText>
      </AddressFormField>
    </Stack>
  );
}

const AddressFormField = ({
  title,
  errorMessage,
  children,
}: InputProps & { errorMessage?: string }): JSX.Element => (
  <FormControl isInvalid={!!errorMessage}>
    <Grid templateColumns="repeat(4, 1fr)" gap={2}>
      <GridItem>
        <FormLabel fontSize="sm">{title}</FormLabel>
      </GridItem>
      <GridItem colSpan={3}>
        {children}
        <FormErrorMessage fontSize="xs">{errorMessage}</FormErrorMessage>
      </GridItem>
    </Grid>
  </FormControl>
);

export default CustomerAddressForm;
