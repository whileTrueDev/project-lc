import { Select, Box, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingDTO } from '@project-lc/shared-types';

export function LiveShoppingProgressSelector(): JSX.Element {
  const { setValue, watch } = useFormContext<LiveShoppingDTO>();

  return (
    <Box>
      <Text>진행상태</Text>
      <Select
        onChange={(event) => {
          setValue('progress', event.target.value);
        }}
        placeholder="진행상태를 선택하세요"
      >
        <option value="adjust">조율중</option>
        <option value="confirm">확정</option>
        <option value="cancel">취소</option>
      </Select>
      {watch('progress') === 'cancel' && (
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
