import { Select, Box, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingDTO, LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import { LiveShopppingProgressType } from '@prisma/client';

export function LiveShoppingProgressSelector(): JSX.Element {
  const { setValue, watch } = useFormContext<LiveShoppingDTO>();

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
              key
            </option>
          );
        })}
      </Select>
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
