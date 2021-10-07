import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Box, Heading } from '@chakra-ui/react';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerPhoneNumber';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
];
export function LiveShoppingRegist(): JSX.Element {
  return (
    <Box w="100%" mt="10">
      <Heading as="h6" size="xs">
        상품
      </Heading>
      <Autocomplete
        options={top100Films}
        getOptionLabel={(option) => option.title}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="상품명을 검색하세요" fullWidth />
        )}
      />
      <LiveShoppingManagerPhoneNumber />
      <LiveShoppingRequestInput />
    </Box>
  );
}

export default LiveShoppingRegist;
