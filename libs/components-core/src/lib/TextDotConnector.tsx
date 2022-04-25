import { Text, TextProps } from '@chakra-ui/layout';

export function TextDotConnector(props: TextProps): JSX.Element {
  return (
    <Text as="span" {...props}>
      {' · '}
    </Text>
  );
}

export default TextDotConnector;
