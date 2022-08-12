import {
  Box,
  Button,
  Input,
  InputGroup,
  Stack,
  Text,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { LiveShoppingSpecialPrice } from '@prisma/client';
import {
  useAdminUpdateLiveShoppingSpecialPriceMutation,
  useAdminUpdateLiveShoppingSpecialPriceMutationDto,
} from '@project-lc/hooks';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import { useState, useEffect } from 'react';

export interface AdminLiveShoppingSpecialPriceProps {
  liveShopping: LiveShoppingWithGoods;
}
/** 관리자용 라이브쇼핑 특가 표시 및 가격 수정 컴포넌트 */
export function AdminLiveShoppingSpecialPrice({
  liveShopping,
}: AdminLiveShoppingSpecialPriceProps): JSX.Element {
  return (
    <Box>
      <Text mb={4}>라이브쇼핑 특가</Text>
      <Stack>
        {liveShopping.goods.options.map((opt) => {
          const specialPriceData = liveShopping.liveShoppingSpecialPrices?.find(
            (sp) => sp.goodsOptionId === opt.id,
          );
          return (
            <Stack direction="row" key={opt.id}>
              <Text as="span">
                {opt.option_title} : {opt.option1}
              </Text>
              {specialPriceData && (
                <SpecialPriceDataDisplayAndUpdateSection
                  specialPriceData={specialPriceData}
                />
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

export default AdminLiveShoppingSpecialPrice;

function SpecialPriceDataDisplayAndUpdateSection({
  specialPriceData,
}: {
  specialPriceData: LiveShoppingSpecialPrice;
}): JSX.Element {
  const [isOpen, { on, off }] = useBoolean();
  const [price, setPrice] = useState(Number(specialPriceData.specialPrice));
  const toast = useToast();

  useEffect(() => {
    setPrice(Number(specialPriceData.specialPrice));
  }, [specialPriceData]);

  const { mutateAsync, isLoading } = useAdminUpdateLiveShoppingSpecialPriceMutation();

  const handleSuccess = (): void => {
    toast({ title: '라이브쇼핑 특가 금액을 변경하였습니다', status: 'success' });
    off();
  };
  const handleError = (e: any): void => {
    toast({ title: '라이브쇼핑 특가 금액 변경 중 오류가 발생했습니다', status: 'error' });
    console.error(e);
  };

  const onChangeSpecialPriceButtonClick = (): void => {
    const mutationDto: useAdminUpdateLiveShoppingSpecialPriceMutationDto = {
      id: specialPriceData.id,
      dto: {
        specialPrice: price,
        discountType: 'W', // 수정시에는 퍼센트 입력 없이 금액입력만 만들어서 W 고정
      },
    };
    mutateAsync(mutationDto).then(handleSuccess).catch(handleError);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Text as="span" fontWeight="bold" color="blue">
          {specialPriceData.specialPrice} 원
        </Text>

        {!isOpen && (
          <Button onClick={on} size="sm">
            변경하기
          </Button>
        )}
      </Stack>
      {isOpen && (
        <InputGroup size="sm">
          <Input
            width="auto"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.currentTarget.value))}
          />
          <Button
            colorScheme="blue"
            onClick={onChangeSpecialPriceButtonClick}
            isLoading={isLoading}
          >
            변경
          </Button>
          <Button
            onClick={() => {
              setPrice(Number(specialPriceData.specialPrice));
              off();
            }}
          >
            취소
          </Button>
        </InputGroup>
      )}
    </Box>
  );
}
