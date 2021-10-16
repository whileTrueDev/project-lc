import { Select, Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { LiveShoppingDTO } from '@project-lc/shared-types';

export function LiveShoppingProgressSelector(): JSX.Element {
  const { setValue } = useFormContext<LiveShoppingDTO>();

  return (
    <Box>
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
    </Box>
  );
}

export default LiveShoppingProgressSelector;
