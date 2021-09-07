/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Checkbox,
  Divider,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TextProps,
} from '@chakra-ui/react';
import {
  PrepayInfoOptions,
  PrepayInfoTypes,
  ShippingPolicyFormData,
  ShippingSetCodeOptions,
  ShippingSetCodes,
  ShippingSetFormData,
} from '@project-lc/shared-types';
import { Controller, useForm, useFormContext } from 'react-hook-form';

function InputWrapperText({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Text width={{ base: '100%', md: '30%' }}>{text}</Text>
      {children}
    </Stack>
  );
}

function BoldText({ children, ...rest }: { children: React.ReactNode } & TextProps) {
  return (
    <Text fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
}

export function ShippingPolicySetForm({
  onSubmit,
}: {
  onSubmit: () => void;
}): JSX.Element {
  // 배송비정책 그룹 폼 컨텍스트
  const groupForm = useFormContext<ShippingPolicyFormData>();

  const onTempSetSubmit = (data: ShippingSetFormData) => {
    console.log(data);
    const prev = groupForm.getValues('shippingSets') || [];
    const tempId = prev.length > 0 ? prev[prev.length - 1].tempId + 1 : 0;
    groupForm.setValue('shippingSets', [...prev, { ...data, tempId }]);
    onSubmit();
  };

  // 배송설정 폼
  const { register, control, setValue, handleSubmit, watch } =
    useForm<ShippingSetFormData>({
      defaultValues: {
        shippingSetCode: 'delivery',
        shippingSetName: ShippingSetCodeOptions.delivery.label,
        prepayInfo: 'delivery',
        deliveryLimit: 'unlimit',
      },
    });

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Stack spacing={6} as="form" onSubmit={handleSubmit(onTempSetSubmit)}>
        {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}
        <Stack className="shippingSetName">
          {/* 배송 설정 이름 */}
          <Stack direction={{ base: 'column', md: 'row' }}>
            <BoldText width={{ base: '100%', md: '30%' }}>배송 설정명</BoldText>
            <Input maxLength={50} {...register('shippingSetName')} />
          </Stack>

          {/* 배송 설정 코드  */}
          <Controller
            control={control}
            name="shippingSetCode"
            render={({ field: { onChange, ...rest } }) => (
              <Select
                {...rest}
                onChange={(e) => {
                  const key = e.currentTarget
                    .value as keyof typeof ShippingSetCodeOptions;
                  // 배송설정명 input 값도 같이 변경
                  setValue('shippingSetName', ShippingSetCodeOptions[key].label);
                  onChange(e);
                }}
              >
                {ShippingSetCodes.map((key) => (
                  <option key={ShippingSetCodeOptions[key].label} value={key}>
                    {ShippingSetCodeOptions[key].label}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* 선불/착불정보  */}
          <Controller
            control={control}
            name="prepayInfo"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="row">
                  {PrepayInfoTypes.map((key) => (
                    <Radio value={key} key={key}>
                      {PrepayInfoOptions[key].label}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          />
        </Stack>
        {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}

        <Divider />

        {/* 반품 배송비 */}
        <Stack className="refundShippingCost" spacing={4}>
          <BoldText>반품 배송비</BoldText>

          <Box>
            <InputWrapperText text="반품 편도">
              <Input type="number" {...register('refundShippingCost')} />
            </InputWrapperText>
            <Checkbox {...register('shipingFreeFlag')}>
              배송비가 무료인 경우, 반품배송비 왕복 &nbsp;
              {((watch('refundShippingCost') || 0) * 2).toLocaleString()}₩ 받기
            </Checkbox>
          </Box>

          <InputWrapperText text="(맞)교환 왕복">
            <Input type="number" {...register('swapShippingCost')} />
          </InputWrapperText>
        </Stack>
        {/* 반품 배송비 */}

        <Divider />

        {/* 기본 배송비 */}
        <Stack>
          <BoldText>기본 배송비</BoldText>
          <Controller
            control={control}
            name="deliveryLimit"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="row">
                  <Radio value="unlimit">대한민국 전국배송</Radio>
                  <Radio value="limit">대한민국 중 지정 지역 배송</Radio>
                </Stack>
              </RadioGroup>
            )}
          />
          <Button onClick={onOpen}>지역추가</Button>
        </Stack>
        {/* 기본 배송비 */}

        <Divider />

        {/* 추가 배송비 */}
        <Stack>
          <BoldText>추가 배송비</BoldText>
          <Button onClick={onOpen}>지역추가</Button>
        </Stack>
        {/* 추가 배송비 */}

        <Divider />

        <Button type="submit">추가하기</Button>
      </Stack>

      {/* 지역정보 추가 모달 */}
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>지역 추가하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>모달바디</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ShippingPolicySetForm;
