import { Box, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { liveShoppingManageStore } from '@project-lc/stores';
import { ChakraAutoComplete } from '..';

export interface BroadcasterAutocompleteProps {
  data: BroadcasterDTO[];
}

export function BroadcasterAutocomplete(
  props: BroadcasterAutocompleteProps,
): JSX.Element {
  const { data } = props;
  const { handleBroadcasterSelect } = liveShoppingManageStore();
  const { setValue } = useFormContext();
  return (
    <Box>
      <Text as="span">방송인</Text>
      <ChakraAutoComplete
        options={data}
        getOptionLabel={(option) => option?.userNickname || ''}
        onChange={(newV) => {
          if (newV) {
            setValue('broadcasterId', newV.userId);
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
