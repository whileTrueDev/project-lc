import {
  Alert,
  Box,
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Text,
} from '@chakra-ui/react';
import { LiveShopppingProgressType } from '@prisma/client';
import { LiveShoppingDTO, LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export function LiveShoppingProgressSelector(): JSX.Element {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<LiveShoppingDTO>();

  const whcr = watch('whiletrueCommissionRate');
  const bccr = watch('broadcasterCommissionRate');

  const isOverThan100 = useMemo(() => Number(whcr) + Number(bccr) > 100, [bccr, whcr]);

  return (
    <Box>
      <Text>진행상태</Text>
      <Select
        onChange={(event) => {
          setValue('progress', event.target.value as LiveShopppingProgressType);
        }}
        placeholder="진행상태를 선택하세요"
      >
        {Object.keys(LIVE_SHOPPING_PROGRESS).map((key) => {
          const value = LIVE_SHOPPING_PROGRESS[key];
          return (
            <option key={key} value={value}>
              {key}
            </option>
          );
        })}
      </Select>
      {watch('progress') === LIVE_SHOPPING_PROGRESS.확정됨 && (
        <>
          <Box mt={5}>
            <Divider />
            <Box mt={2}>
              <Text>판매 수수료율</Text>
              <Collapse in={isOverThan100} animateOpacity>
                <Alert my={2} status="error" maxW="300px">
                  판매 수수료율의 합은 100을 초과할 수 없습니다.
                </Alert>
              </Collapse>
              <FormControl isInvalid={!!errors.whiletrueCommissionRate}>
                <FormLabel>와일트루</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="5"
                    type="number"
                    {...register('whiletrueCommissionRate', {
                      valueAsNumber: true,
                      max: { value: 100, message: '0~100사이의 값을 입력하세요' },
                      min: { value: 0, message: '0~100사이의 값을 입력하세요' },
                      validate: () => !isOverThan100,
                    })}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
                {errors.whiletrueCommissionRate && (
                  <FormErrorMessage>
                    {errors.whiletrueCommissionRate.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.broadcasterCommissionRate}>
                <FormLabel>방송인</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="10"
                    type="number"
                    {...register('broadcasterCommissionRate', {
                      valueAsNumber: true,
                      max: { value: 100, message: '0~100사이의 값을 입력하세요' },
                      min: { value: 0, message: '0~100사이의 값을 입력하세요' },
                      validate: () => !isOverThan100,
                    })}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
                {errors.broadcasterCommissionRate && (
                  <FormErrorMessage>
                    {errors.broadcasterCommissionRate.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </Box>
        </>
      )}
      {watch('progress') === LIVE_SHOPPING_PROGRESS.취소됨 && (
        <Box mt="5">
          <Text>취소사유</Text>
          <Select
            onChange={(event) => {
              setValue('rejectionReason', event.target.value);
            }}
            placeholder="취소사유를 선택하세요"
          >
            <option value="제품 부적절">제품 부적절</option>
            <option value="상품내용 불충분">상품내용 불충분</option>
            <option value="협의 취소">협의 취소</option>
            <option value="기타: 고객센터문의">기타: 고객센터문의</option>
          </Select>
        </Box>
      )}
    </Box>
  );
}

export default LiveShoppingProgressSelector;
