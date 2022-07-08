import { Text, TextProps } from '@chakra-ui/react';

export interface ClickableUnderlinedTextProps extends TextProps {
  onClick: () => void;
}
export function ClickableUnderlinedText({
  onClick,
  fontSize = 'xs',
  color = 'GrayText',
  ...rest
}: ClickableUnderlinedTextProps): JSX.Element {
  return (
    <Text
      as="span"
      textDecor="underline"
      cursor="pointer"
      fontSize={fontSize}
      color={color}
      onClick={onClick}
      {...rest}
    />
  );
}

export default ClickableUnderlinedText;
