/* eslint-disable react/jsx-props-no-spreading */
import { QuestionIcon } from '@chakra-ui/icons';
import { HStack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import { RadioGroupProps } from '@chakra-ui/react';
import { GoodsStatus } from '@prisma/client';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';
import TextWithPopperButton from './TextWithPopperButton';

// 상품등록 - 판매정보
const GOODS_STATUS: { value: GoodsStatus; label: string }[] = [
  { value: 'normal', label: '정상' },
  { value: 'purchasing', label: '재고확보중' },
  { value: 'unsold', label: '판매중지' },
];
// 상품등록 - 청약철회
const GOODS_CANCEL_TYPE: { value: '0' | '1'; label: string }[] = [
  { value: '0', label: '가능' },
  { value: '1', label: '불가 (취소/교환/반품 불가)' },
];

export type GoodsRegistRadioName = keyof Omit<RegistGoodsDto, 'options' | 'image'>;
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
} & Partial<RadioGroupProps>) {
  const { register, watch } = useFormContext<RegistGoodsDto>();
  return (
    <RadioGroup value={watch(name, values[0].value)} {...rest}>
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
    <SectionWithTitle title="판매정보">
      <HStack>
        <Text>판매상태</Text>
        <GoodsRegistRadio name="goods_status" values={GOODS_STATUS} />
      </HStack>

      <HStack>
        <TextWithPopperButton
          title="청약철회"
          iconAriaLabel="청약철회 설명"
          icon={<QuestionIcon />}
        >
          <Text>청약철회 불가 선택 시 결제 확인 이후, 취소, 반품, 교환이 불가합니다</Text>
        </TextWithPopperButton>
        <GoodsRegistRadio name="cancel_type" values={GOODS_CANCEL_TYPE} />
      </HStack>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataSales;
