import { Select } from '@material-ui/core';
import { Box } from '@chakra-ui/react';

export function LiveShoppingProgressSelector(): JSX.Element {
  return (
    <Box>
      <Select placeholder="Select option">
        <option value="option1">조율중</option>
        <option value="option2">확정</option>
        <option value="option3">취소</option>
      </Select>
    </Box>
  );
}

export default LiveShoppingProgressSelector;
