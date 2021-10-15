import { Select } from '@material-ui/core';
import { Box } from '@chakra-ui/react';

export function LiveShoppingProgressSelector(): JSX.Element {
  return (
    <Box>
      <Select placeholder="Select option" defaultValue="adjust">
        <option value="adjust">조율중</option>
        <option value="confirm">확정</option>
        <option value="cancel">취소</option>
      </Select>
    </Box>
  );
}

export default LiveShoppingProgressSelector;
