import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputProps,
  Kbd,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import TextWithPopperButton from '@project-lc/components-core/TextWithPopperButton';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useDisplaySize } from '@project-lc/hooks';
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { GoodsRegistRadio } from './GoodsRegistDataSales';
import { GoodsFormOption, GoodsFormValues } from './GoodsRegistForm';

export function GoodsOptionInput({
  label,
  inputProps,
}: {
  label: string;
  inputProps?: Partial<InputProps>;
}): JSX.Element {
  return (
    <HStack>
      <Text flex="1">{label}</Text>
      <Input flex="1.5" {...inputProps} size="sm" />
    </HStack>
  );
}

const PRICE_INPUT_MAX = 99999999;

function NoOptionInput(): JSX.Element {
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
          max: PRICE_INPUT_MAX,
        }}
      />
      <GoodsOptionInput
        label="판매가 (할인가)"
        inputProps={{
          type: 'number',
          ...register(`options.0.price` as const, {
            valueAsNumber: true,
          }),
          max: PRICE_INPUT_MAX,
        }}
      />

      {/* [상품 옵션] 재고 기능 임시 제거 */}
      {/* <GoodsOptionInput
        label="재고"
        inputProps={{
          type: 'number',
          ...register(`options.0.supply.stock` as const, {
            valueAsNumber: true,
          }),
        }}
      /> */}
      {/* [상품 옵션] 재고 기능 임시 제거 */}
    </Stack>
  );
}

function UseOptionInput(): JSX.Element {
  const {
    watch,
    getValues,
    setValue,
    control,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<GoodsFormValues>();
  const { fields, append, remove } = useFieldArray<GoodsFormValues, 'options', 'fieldId'>(
    {
      control,
      name: 'options' as const,
      keyName: 'fieldId',
    },
  );
  const { isMobileSize } = useDisplaySize();

  const inputWidth = isMobileSize ? '74px' : 'auto';

  const addOption = (): void => {
    // 1. 옵션명, 옵션값 체크 ----------------------------------
    const optionTitle = getValues('option_title').trim();
    const optionValues = getValues('option_values').trim();

    const existOptions = getValues('options');

    // 옵션명은 최대 5개까지 등록 가능(퍼스트몰 제한)
    const existOptionUniqueTitles = [
      ...new Set(existOptions.map((opt) => opt.option_title)),
    ];
    const overMaxOptionTitleCount =
      existOptionUniqueTitles.length >= 5 &&
      !existOptionUniqueTitles.includes(optionTitle);

    const hasError = !optionTitle || !optionValues || overMaxOptionTitleCount;

    if (!optionTitle) {
      setError('option_title', {
        type: 'validate',
        message: '옵션명을 입력해주세요',
      });
    }
    if (!optionValues) {
      setError('option_values', {
        type: 'validate',
        message: '옵션값을 입력해주세요',
      });
    }
    if (overMaxOptionTitleCount) {
      setError('option_title', {
        type: 'error',
        message: '옵션명은 최대 5개까지 등록 가능합니다',
      });
    }

    if (hasError) return;

    // 2. 중복되는 옵션값 제거 ----------------------
    const validOptionValues = optionValues
      .split(',')
      .map((value) => value.trim())
      .filter(
        (value) =>
          !existOptions.find(
            (existOpt) =>
              existOpt.option_title === optionTitle && existOpt.option1 === value,
          ),
      );

    // 3. 옵션값 등록 ------------------
    const willBeAppendedValues: GoodsFormOption[] = validOptionValues.map((optValue) => ({
      option_title: optionTitle,
      option1: optValue,
      consumer_price: 0,
      price: 0,
      option_view: 'Y',
      option_type: 'direct',
      supply: {
        stock: 0,
      },
    }));
    append(willBeAppendedValues);

    // 4. 오류, 옵션명, 옵션값  초기화  ------------------
    clearErrors(['option_title', 'option_values']);
    setValue('option_title', '');
    setValue('option_values', '');
  };

  return (
    <Stack>
      {/* 옵션명 & 옵션값 입력부분 */}
      <FormControl
        id="option_title_values"
        isInvalid={!!errors.option_title || !!errors.option_values}
      >
        <HStack flexWrap="wrap">
          <HStack mr={2}>
            <FormLabel m={0}>옵션명</FormLabel>
            <Input
              {...register('option_title')}
              size="sm"
              w={150}
              isInvalid={!!errors.option_title}
              placeholder="색상"
            />
          </HStack>

          <HStack>
            <FormLabel m={0}>
              <TextWithPopperButton
                title="옵션값"
                iconAriaLabel="옵션값 설명"
                icon={<InfoIcon />}
              >
                <Text>
                  <Kbd>,</Kbd> 로 옵션값을 구분하여 입력하면 <br />
                  여러 옵션값을 한 번에 입력할 수 있습니다
                </Text>
              </TextWithPopperButton>
            </FormLabel>
            <Input
              isInvalid={!!errors.option_values}
              {...register('option_values')}
              size="sm"
              w={150}
              placeholder="검정, 노랑, 파랑"
            />
          </HStack>

          <Button size="sm" onClick={addOption} ml={2}>
            옵션값 추가
          </Button>
        </HStack>

        {errors.option_title && (
          <FormErrorMessage>{errors.option_title.message}</FormErrorMessage>
        )}
        {errors.option_values && (
          <FormErrorMessage>{errors.option_values.message}</FormErrorMessage>
        )}
      </FormControl>

      {/* 입력된 옵션값 표시부분 - 가격, 노출여부 조절 */}
      {fields.length === 0 && <Text>상품 옵션을 추가해주세요</Text>}
      {fields.map((field, index) => (
        <Stack
          key={field.fieldId}
          {...boxStyle}
          direction={isMobileSize ? 'column' : 'row'}
          spacing={1}
          flexWrap="wrap"
        >
          {/* 삭제버튼과 옵션명:옵션값 */}
          <HStack mr={1} flexGrow={0.5} flexShrink={0} minWidth={150}>
            <CloseButton onClick={() => remove(index)} />
            <Text minWidth="60px">
              {`${getValues(`options.${index}.option_title`)} :`}
            </Text>
            <Input {...register(`options.${index}.option1` as const)} size="sm" />
          </HStack>

          <HStack mb={1}>
            {/* 정가 */}
            <HStack>
              <Text minWidth="40px">정가</Text>
              <Input
                {...register(`options.${index}.consumer_price` as const, {
                  valueAsNumber: true,
                })}
                max={PRICE_INPUT_MAX}
                width={inputWidth}
                type="number"
                size="sm"
              />
            </HStack>
            {/* 정가 */}

            {/* 판매가 */}
            <HStack mb={1}>
              <Text minWidth="40px">판매가</Text>
              <Input
                {...register(`options.${index}.price` as const, {
                  valueAsNumber: true,
                })}
                max={PRICE_INPUT_MAX}
                width={inputWidth}
                type="number"
                size="sm"
              />
            </HStack>
            {/* 판매가 */}
          </HStack>

          <HStack>
            {/* [상품 옵션] 재고 기능 임시 제거 */}
            {/* <HStack>
              <Text minWidth="40px">재고</Text>
              <Input
                {...register(`options.${index}.supply.stock` as const, {
                  valueAsNumber: true,
                })}
                width={inputWidth}
                size="sm"
              />
            </HStack> */}
            {/* [상품 옵션] 재고 기능 임시 제거 */}

            {/* 노출 */}
            <RadioGroup
              mb={1}
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
            {/* 노출 */}
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

  const initializeOptions = useCallback(
    (value: string) => {
      if (value === '1') {
        // 옵션 사용하는 경우
        setValue('options', []);
      } else {
        // 옵션 사용 안하는 경우
        setValue('options', [
          {
            option_type: 'direct',
            option1: '',
            option_title: '',
            consumer_price: 0,
            price: 0,
            option_view: 'Y',
            supply: {
              stock: 0,
            },
          },
        ]);
      }
    },
    [setValue],
  );

  return (
    <SectionWithTitle title="판매 옵션" variant="outlined">
      <Text fontWeight="bold">옵션 사용 여부</Text>
      {/* onChange 시 옵션초기화 */}
      <Box mb={4}>
        <GoodsRegistRadio
          name="option_use"
          values={OPTION_USE}
          onChange={initializeOptions}
        />
        <Text fontWeight="normal" as="span" color="gray.500" fontSize="sm">
          (사용 여부 변경시 기존에 추가했던 옵션은 모두 사라집니다.)
        </Text>
      </Box>

      {/* 옵션 사용하지 않는 경우 */}
      {watch('option_use') === '0' && <NoOptionInput />}
      {/* 옵션 사용하는 경우 */}
      {watch('option_use') === '1' && <UseOptionInput />}
    </SectionWithTitle>
  );
}

export default GoodsRegistDataOptions;
