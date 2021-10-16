import { Box, Text } from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

export function LiveShoppingDatePicker(props: {
  title: string;
  registerName: string;
}): JSX.Element {
  const { title, registerName } = props;
  const { register } = useFormContext();
  const now = dayjs().format('YYYY-MM-DDThh:mm');
  return (
    <Box>
      <Text>{title}</Text>
      <TextField
        {...register(`${registerName}`)}
        id="datetime-local"
        type="datetime-local"
        defaultValue={now}
        inputProps={{
          min: now,
        }}
      />
    </Box>
  );
}

export default LiveShoppingDatePicker;
