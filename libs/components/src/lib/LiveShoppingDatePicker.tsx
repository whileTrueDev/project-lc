import { Box, Text } from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

export function LiveShoppingDatePicker(props: {
  title: string;
  registerName: string;
  min?: string;
}): JSX.Element {
  const { title, registerName, min } = props;
  const { register } = useFormContext();
  const now = dayjs().format('YYYY-MM-DDThh:mm');
  return (
    <Box>
      <Text>{title}</Text>
      <TextField
        {...register(`${registerName}`, { min: min || now })}
        id="datetime-local"
        type="datetime-local"
        defaultValue={now}
        inputProps={{
          min: min || now,
        }}
      />
    </Box>
  );
}

export default LiveShoppingDatePicker;
