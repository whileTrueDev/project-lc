import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Stack, Heading } from '@chakra-ui/react';
import { liveShoppingRegist } from '@project-lc/stores';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerPhoneNumber';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';
import { useApprovedGoodsList } from '../../../hooks/src/lib/queries/useApprovedGoodsList';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
];

export function LiveShoppingRegist(): JSX.Element {
  const {
    selectedGoods,
    mail,
    phoneNumber,
    requests,
    handleGoodsSelect,
    handleEmailInput,
    handlePhoneNumberInput,
    handleRequestsInput,
  } = liveShoppingRegist();
  const goodsList = useApprovedGoodsList({
    email: 'leejineun94@gmail.com',
    needName: true,
  });
  return (
    <Stack w="100%" mt="10" spacing={12}>
      <Heading as="h6" size="xs">
        상품
      </Heading>
      <Autocomplete
        options={top100Films}
        getOptionLabel={(option) => option.title}
        style={{ width: 300, marginTop: 0 }}
        renderInput={(params) => (
          <TextField {...params} label="등록할 상품명을 검색하세요" fullWidth />
        )}
        value={selectedGoods}
        onChange={(_, newValue) => {
          handleGoodsSelect(newValue);
        }}
      />
      <LiveShoppingManagerPhoneNumber
        mail={mail}
        phoneNumber={phoneNumber}
        handleEmailInput={handleEmailInput}
        handlePhoneNumberInput={handlePhoneNumberInput}
      />
      <LiveShoppingRequestInput
        requests={requests}
        handleRequestsInput={handleRequestsInput}
      />
    </Stack>
  );
}

export default LiveShoppingRegist;
