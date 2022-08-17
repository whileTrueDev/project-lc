import {
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  Text,
  Divider,
  Box,
} from '@chakra-ui/react';
import { GoodsOptions } from '@prisma/client';
import {
  LiveShoppingSpecialPriceDiscountType,
  LiveShoppingSpecialPricesValue,
} from '@project-lc/shared-types';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface LiveShoppingSpecialPriceOptionsProps {
  goodsOptions: GoodsOptions[];
}
export function LiveShoppingSpecialPriceOptions({
  goodsOptions,
}: LiveShoppingSpecialPriceOptionsProps): JSX.Element {
  const {
    register,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<
    LiveShoppingSpecialPricesValue & LiveShoppingSpecialPriceDiscountType
  >();

  const discountType = watch('discountType');
  const discountRate = watch('discountRate') || undefined;

  const { fields, replace } = useFieldArray({
    control,
    name: 'specialPrices',
  });

  // goodsOptions 가 바뀔때만 specialPrices field 초기화
  useEffect(() => {
    setValue(
      'specialPrices',
      goodsOptions.map((opt) => ({
        specialPrice: Number(opt.price),
        goodsId: opt.goodsId,
        goodsOptionId: opt.id,
        discountType,
        discountRate,
      })),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodsOptions, setValue]);

  // discountType 변경시
  useEffect(() => {
    const prevLieShoppingSpecialPrices = getValues('specialPrices');
    if (prevLieShoppingSpecialPrices) {
      replace(prevLieShoppingSpecialPrices.map((prev) => ({ ...prev, discountType })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType]);

  // discountRate 할인율 변경시
  useEffect(() => {
    const prevLieShoppingSpecialPrices = getValues('specialPrices');
    if (prevLieShoppingSpecialPrices) {
      replace(
        prevLieShoppingSpecialPrices.map((prev) => {
          const originGoodsOption = goodsOptions.find(
            (opt) => opt.id === prev.goodsOptionId,
          );
          let newSpecialPrice = prev.specialPrice;
          if (originGoodsOption) {
            if (discountRate) {
              const notDiscountedOriginPrice = Number(originGoodsOption.consumer_price);
              const discountAmount = Math.floor(
                notDiscountedOriginPrice * 0.01 * discountRate,
              );
              newSpecialPrice = notDiscountedOriginPrice - discountAmount;
            } else {
              // 할인율이 입력되지 않은 경우 원래상품옵션 판매가로 설정
              newSpecialPrice = Number(originGoodsOption.price);
            }
          }
          return {
            ...prev,
            discountRate,
            specialPrice: newSpecialPrice,
          };
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountRate]);

  return (
    <Stack spacing={4}>
      {fields.map((field, index) => {
        const originGoodsOption = goodsOptions.find(
          (opt) => opt.id === field.goodsOptionId,
        );
        if (!originGoodsOption) return null;
        return (
          <Box key={field.id}>
            <Stack
              flexWrap="wrap"
              direction={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              mb={4}
            >
              <Stack direction="row" flexGrow={0} flexShrink={0} width="250px">
                {originGoodsOption.option_title && originGoodsOption.option1 && (
                  <Text>
                    {originGoodsOption.option_title} : {originGoodsOption.option1}
                  </Text>
                )}
              </Stack>

              <Stack direction="row" flexGrow={0} flexShrink={0} width="200px">
                <Text minWidth="40px">정가 : </Text>
                <Text>{originGoodsOption.consumer_price}</Text>
              </Stack>

              <Stack direction="row" flexGrow={1} alignItems="center">
                <Text minWidth="40px">라이브쇼핑 특가 :</Text>
                {discountType === 'P' && <Text>{field.specialPrice}</Text>}
                {discountType === 'W' && (
                  <FormControl
                    isInvalid={!!errors?.specialPrices?.[index]?.specialPrice}
                    width="auto"
                  >
                    <Input
                      size="sm"
                      type="number"
                      {...register(`specialPrices.${index}.specialPrice`, {
                        valueAsNumber: true,
                        min: { value: 1, message: '최소값은 1입니다' },
                        max: {
                          value: Number(originGoodsOption.consumer_price),
                          message: '라이브쇼핑 특가는 기존 정가보다 낮아야 합니다',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.specialPrices?.[index]?.specialPrice &&
                        errors?.specialPrices?.[index]?.specialPrice?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Stack>
            </Stack>
            <Divider />
          </Box>
        );
      })}
    </Stack>
  );
}

export default LiveShoppingSpecialPriceOptions;
