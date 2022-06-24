import { Box, Text } from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { useAdminBroadcaster } from '@project-lc/hooks';
import { liveShoppingManageStore } from '@project-lc/stores';
import { useFormContext } from 'react-hook-form';

export function BroadcasterAutocomplete(): JSX.Element {
  const { data } = useAdminBroadcaster();
  const { handleBroadcasterSelect } = liveShoppingManageStore();
  const { setValue } = useFormContext();
  return (
    <Box>
      <Text as="span">방송인</Text>
      <ChakraAutoComplete
        options={data || []}
        getOptionLabel={(option) =>
          option ? `${option.userNickname} (${option.email})` : ''
        }
        onChange={(newV) => {
          if (newV) {
            setValue('broadcasterId', newV.id);
            handleBroadcasterSelect(`${newV.userNickname} (${newV.email})`);
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
