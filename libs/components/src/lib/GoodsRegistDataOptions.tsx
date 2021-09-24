/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  CloseButton,
  HStack,
  Input,
  InputProps,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { boxStyle } from '../constants/commonStyleProps';
import { GoodsRegistRadio } from './GoodsRegistDataSales';
import { GoodsFormValues } from './GoodsRegistForm';
import SectionWithTitle from './SectionWithTitle';

export function GoodsOptionInput({
  label,
  inputProps,
}: {
  label: string;
  inputProps?: Partial<InputProps>;
}) {
  return (
    <HStack>
      <Text flex="1">{label}</Text>
      <Input flex="1.5" {...inputProps} size="sm" />
    </HStack>
  );
}

function NoOptionInput() {
  const { register } = useFormContext<GoodsFormValues>();
  return (
    <Stack maxWidth="md">
      <GoodsOptionInput
        label="정가 (미할인가)"
        inputProps={{
          type: 'number',
          ...register(`options.0.consumer_price` as const, {
            valueAsNumber: true,
          }),
        }}
      />
      <GoodsOptionInput
        label="판매가 (할인가)"
        inputProps={{
          type: 'number',
          ...register(`options.0.price` as const, {
            valueAsNumber: true,
          }),
        }}
      />
      <GoodsOptionInput
        label="재고"
        inputProps={{
          type: 'number',
          ...register(`options.0.supply.stock` as const, {
            valueAsNumber: true,
          }),
        }}
      />
    </Stack>
  );
}

function UseOptionInput() {
  const { watch, control, register } = useFormContext<GoodsFormValues>();
  const { fields, append, remove } = useFieldArray<GoodsFormValues, 'options'>({
    control,
    name: 'options' as const,
  });
  const { isMobileSize } = useDisplaySize();

  const inputWidth = isMobileSize ? '100px' : 'auto';

  const addOption = () => {
    append({
      option1: '',
      consumer_price: 0,
      price: 0,
      option_view: 'Y',
      option_type: 'direct',
      supply: {
        stock: 0,
      },
    });
  };

  return (
    <Stack>
      <HStack>
        <Text>옵션명</Text>
        <Input size="sm" w={200} {...register('option_title', { required: true })} />
        <Button size="sm" onClick={addOption} ml={2}>
          옵션값 추가
        </Button>
      </HStack>

      {fields.map((field, index) => (
        <Stack
          key={field.id}
          {...boxStyle}
          direction={isMobileSize ? 'column' : 'row'}
          spacing={1}
        >
          <HStack>
            <CloseButton onClick={() => remove(index)} />
            <HStack>
              <Text minWidth="60px">옵션값</Text>
              <Input
                {...register(`options.${index}.option1` as const, {
                  required: true,
                })}
                size="sm"
              />
            </HStack>
          </HStack>
          <HStack>
            <HStack>
              <Text minWidth="50px">정가</Text>
              <Input
                {...register(`options.${index}.consumer_price` as const, {
                  valueAsNumber: true,
                })}
                width={inputWidth}
                size="sm"
              />
            </HStack>
            <HStack>
              <Text minWidth="50px">판매가</Text>
              <Input
                {...register(`options.${index}.price` as const, {
                  valueAsNumber: true,
                })}
                width={inputWidth}
                size="sm"
              />
            </HStack>
          </HStack>
          <HStack>
            <HStack>
              <Text minWidth="50px">재고</Text>
              <Input
                {...register(`options.${index}.supply.stock` as const, {
                  valueAsNumber: true,
                })}
                width={inputWidth}
                size="sm"
              />
            </HStack>
            {/* 노출 */}
            <RadioGroup
              minWidth={isMobileSize ? '150px' : 'auto'}
              value={watch(`options.${index}.option_view` as const, 'Y')}
            >
              <HStack>
                <Radio {...register(`options.${index}.option_view` as const)} value="Y">
                  노출
                </Radio>
                <Radio {...register(`options.${index}.option_view` as const)} value="N">
                  미노출
                </Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </Stack>
      ))}
    </Stack>
  );
}

const OPTION_USE = [
  { value: '1', label: '사용' },
  { value: '0', label: '사용 안 함' },
];

export function GoodsRegistDataOptions(): JSX.Element {
  const { watch, setValue } = useFormContext<GoodsFormValues>();

  return (
    <SectionWithTitle title="판매 옵션">
      <Text fontWeight="bold">
        옵션 사용 여부
        <Text as="span" color="gray.500" fontSize="sm">
          ( * 변경시 기존에 추가했던 옵션은 모두 사라집니다)
        </Text>
      </Text>
      {/* onChange 시 옵션초기화 */}
      <GoodsRegistRadio
        mb={4}
        name="option_use"
        values={OPTION_USE}
        onChange={() => {
          setValue('option_title', '');
          setValue('options', [
            {
              option_type: 'direct',
              option1: '',
              consumer_price: 0,
              price: 0,
              option_view: 'Y',
              supply: {
                stock: 0,
              },
            },
          ]);
        }}
      />

      {/* 옵션 사용하지 않는 경우 */}
      {watch('option_use') === '0' && <NoOptionInput />}
      {/* 옵션 사용하는 경우 */}
      {watch('option_use') === '1' && <UseOptionInput />}
    </SectionWithTitle>
  );
}

export default GoodsRegistDataOptions;
