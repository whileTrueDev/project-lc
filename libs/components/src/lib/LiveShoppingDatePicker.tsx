import { Box } from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';

export function LiveShoppingDatePicker(): JSX.Element {
  return (
    <Box>
      <TextField
        id="datetime-local"
        label="방송일자를 지정하세요"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        // className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}

export default LiveShoppingDatePicker;
