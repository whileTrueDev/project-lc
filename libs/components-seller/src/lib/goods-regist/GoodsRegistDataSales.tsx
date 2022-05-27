import { QuestionIcon } from '@chakra-ui/icons';
import { HStack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import { RadioGroupProps, Stack } from '@chakra-ui/react';
import { GoodsStatus } from '@prisma/client';
import { GOODS_CANCEL_TYPE } from '@project-lc/components-constants/goodsRegistTypes';
import TextWithPopperButton from '@project-lc/components-core/TextWithPopperButton';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

// 상품등록 - 판매정보
const GOODS_STATUS: { value: GoodsStatus; label: string }[] = [
  { value: 'normal', label: '정상' },
  { value: 'purchasing', label: '재고확보중' },
  { value: 'unsold', label: '판매중지' },
];

export type GoodsRegistRadioName = keyof Pick<
  RegistGoodsDto,
  // 프론트구현 때, 필요한 값 제거하시면 됩니다.
  'goods_status' | 'cancel_type' | 'option_use'
>;
// 상품등록 폼에서 사용하는 라디오그룹
export function GoodsRegistRadio({
  name,
  values,
  ...rest
}: {
  name: GoodsRegistRadioName;
  values: {
    value: RegistGoodsDto[typeof name];
    label: string;
  }[];
} & Partial<RadioGroupProps>): JSX.Element {
  const { register, watch } = useFormContext<RegistGoodsDto>();
  return (
    <RadioGroup value={watch(name)} {...rest}>
      <HStack>
        {values.map((item) => {
          const { value, label } = item;
          return (
            <Radio key={label} {...register(name)} value={value}>
              {label}
            </Radio>
          );
        })}
      </HStack>
    </RadioGroup>
  );
}

export function GoodsRegistDataSales(): JSX.Element {
  return (
    <SectionWithTitle title="판매정보" variant="outlined">
      <Stack>
        <Stack spacing={{ base: 2, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
          <Text mr="24px">판매상태</Text>
          <GoodsRegistRadio name="goods_status" values={GOODS_STATUS} />
        </Stack>

        <Stack spacing={{ base: 2, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
          <TextWithPopperButton
            title="청약철회"
            iconAriaLabel="청약철회 설명"
            icon={<QuestionIcon />}
          >
            <Text>
              청약철회 불가 선택 시 결제 확인 이후, 취소, 반품, 교환이 불가합니다
            </Text>
          </TextWithPopperButton>
          <GoodsRegistRadio name="cancel_type" values={GOODS_CANCEL_TYPE} />
        </Stack>
      </Stack>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataSales;
