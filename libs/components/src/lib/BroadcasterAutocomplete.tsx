import { Box, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { liveShoppingManageStore } from '@project-lc/stores';
import { useAdminBroadcaster } from '@project-lc/hooks';
import { ChakraAutoComplete } from '..';

export function BroadcasterAutocomplete(): JSX.Element {
  const { data } = useAdminBroadcaster();
  const { handleBroadcasterSelect } = liveShoppingManageStore();
  const { setValue } = useFormContext();
  return (
    <Box>
      <Text as="span">방송인</Text>
      <ChakraAutoComplete
        options={data || []}
        getOptionLabel={(option) => option?.userNickname || ''}
        onChange={(newV) => {
          if (newV) {
            setValue('broadcasterId', newV.id);
            handleBroadcasterSelect(newV.userNickname);
          } else {
            setValue('broadcasterId', null);
            handleBroadcasterSelect(null);
          }
        }}
      />
    </Box>
  );
}

export default BroadcasterAutocomplete;
