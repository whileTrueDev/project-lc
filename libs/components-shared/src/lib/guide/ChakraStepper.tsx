import { chakra, theme, useColorModeValue } from '@chakra-ui/react';
import { makeStyles, Stepper, StepperProps } from '@material-ui/core';

function CustomStepper(props: StepperProps): JSX.Element {
  const useStyle = makeStyles({
    root: {
      backgroundColor: useColorModeValue('inherit', theme.colors.gray[700]),
      '& .MuiStepIcon-root': {
        color: useColorModeValue(theme.colors.gray[300], theme.colors.whiteAlpha['800']),
      },
      '& .MuiStepIcon-active, .MuiStepIcon-completed': {
        color: theme.colors.blue['500'],
        '& .MuiStepIcon-text': {
          fill: 'white',
        },
      },
      '& .MuiStepLabel-label': {
        color: useColorModeValue('inherit', theme.colors.whiteAlpha[800]),
      },
    },
  });
  const classes = useStyle();

  return (
    <Stepper
      classes={{
        root: props.classes?.root || classes.root,
      }}
      {...props}
    />
  );
}

export const ChakraStepper = chakra(CustomStepper, {});
