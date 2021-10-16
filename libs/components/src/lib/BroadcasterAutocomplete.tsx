import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { liveShoppingManage } from '@project-lc/stores';
import { ChakraAutoComplete } from '..';

export function BroadcasterAutocomplete(props: any): JSX.Element {
  const { data } = props;
  const { handleBroadcasterSelect } = liveShoppingManage();
  const { setValue } = useFormContext();
  return (
    <Box>
      <ChakraAutoComplete
        options={data}
        getOptionLabel={(option) => option?.userNickname || ''}
        onChange={(newV) => {
          if (newV) {
            setValue('broadcaster', newV.id);
            handleBroadcasterSelect(newV);
          } else {
            setValue('broadcaster', null);
            handleBroadcasterSelect(null);
          }
        }}
      />
    </Box>
  );
}

export default BroadcasterAutocomplete;
