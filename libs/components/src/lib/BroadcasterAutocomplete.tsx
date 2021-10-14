import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Box } from '@chakra-ui/react';

export function BroadcasterAutocomplete(props: any): JSX.Element {
  const { data } = props;
  return (
    <Box>
      <Autocomplete
        options={data}
        // getOptionLabel={(option) => option?.userNickname || ''}
        style={{ width: 300, marginTop: 0 }}
        renderInput={(params) => (
          <TextField {...params} label="검색할 방송인을 검색하세요" fullWidth />
        )}
        renderOption={(option) => option?.userNickname || ''}
        // value={selectedGoods}
        // onChange={(_, newValue) => {
        //   setValue('goods_id', newValue?.id || null);
        //   handleGoodsSelect(newValue);
        // }}
      />
    </Box>
  );
}

export default BroadcasterAutocomplete;
